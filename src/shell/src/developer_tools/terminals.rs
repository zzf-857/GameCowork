//! Real interactive Windows ConPTY sessions. A WebSocket owns one shell/job;
//! closing it cannot terminate a separately launched editor or another session.
use axum::extract::ws::{CloseFrame, Message, WebSocket};
use futures::{SinkExt, StreamExt};
use serde_json::{json, Value};
use std::{
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicBool, AtomicUsize, Ordering},
        Arc, Mutex,
    },
};
use tokio::sync::mpsc;
use uuid::Uuid;

const MAX_SESSIONS: usize = 16;
const MAX_INPUT_BYTES: usize = 64 * 1024;
static ACTIVE: AtomicUsize = AtomicUsize::new(0);
#[derive(Clone, Debug)]
pub struct TerminalError {
    status: u16,
    message: String,
}
impl TerminalError {
    fn new(status: u16, message: impl Into<String>) -> Self {
        Self {
            status,
            message: message.into(),
        }
    }
    pub fn status(&self) -> u16 {
        self.status
    }
    pub fn json(&self) -> Value {
        json!({"type":"error","error":self.message,"message":self.message})
    }
}
impl std::fmt::Display for TerminalError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}
impl std::error::Error for TerminalError {}
pub enum TerminalEvent {
    Output(Vec<u8>),
    Exit(i32),
    Error(String),
}
struct Slot;
impl Slot {
    fn reserve() -> Result<Self, TerminalError> {
        ACTIVE
            .fetch_update(Ordering::AcqRel, Ordering::Acquire, |current| {
                (current < MAX_SESSIONS).then_some(current + 1)
            })
            .map(|_| Self)
            .map_err(|_| TerminalError::new(429, "Too many interactive terminal sessions"))
    }
}
impl Drop for Slot {
    fn drop(&mut self) {
        ACTIVE.fetch_sub(1, Ordering::AcqRel);
    }
}
pub struct TerminalSession {
    inner: Arc<Inner>,
    events: Option<mpsc::Receiver<TerminalEvent>>,
}
#[derive(Clone)]
pub struct TerminalControl {
    inner: Arc<Inner>,
}
struct Inner {
    id: String,
    pid: u32,
    cwd: PathBuf,
    closed: AtomicBool,
    _slot: Slot,
    #[cfg(windows)]
    native: native::Native,
}
impl Inner {
    fn close(&self) {
        if !self.closed.swap(true, Ordering::AcqRel) {
            #[cfg(windows)]
            self.native.close();
        }
    }
}
impl Drop for Inner {
    fn drop(&mut self) {
        self.close();
    }
}
impl TerminalSession {
    pub fn spawn(
        cwd: &Path,
        allowed: &[PathBuf],
        cols: u16,
        rows: u16,
    ) -> Result<Self, TerminalError> {
        dimensions(cols, rows)?;
        let cwd = std::fs::canonicalize(cwd).map_err(|e| {
            TerminalError::new(
                400,
                format!("Terminal working directory is unavailable: {e}"),
            )
        })?;
        if !cwd.is_dir() {
            return Err(TerminalError::new(
                400,
                "Terminal working directory is not a directory",
            ));
        }
        let permitted = allowed
            .iter()
            .filter_map(|root| std::fs::canonicalize(root).ok())
            .any(|root| crate::files::within(&cwd, &root));
        if !permitted {
            return Err(TerminalError::new(
                403,
                "Terminal cwd is outside the authorized opened workspace",
            ));
        }
        let slot = Slot::reserve()?;
        let (tx, rx) = mpsc::channel(128);
        #[cfg(windows)]
        {
            let native = native::Native::spawn(&cwd, cols, rows, tx)?;
            let pid = native.pid;
            Ok(Self {
                inner: Arc::new(Inner {
                    id: Uuid::new_v4().to_string(),
                    pid,
                    cwd,
                    closed: AtomicBool::new(false),
                    _slot: slot,
                    native,
                }),
                events: Some(rx),
            })
        }
        #[cfg(not(windows))]
        {
            let _ = (slot, tx, rx);
            Err(TerminalError::new(
                501,
                "Interactive ConPTY terminals require Windows",
            ))
        }
    }
    pub fn pid(&self) -> u32 {
        self.inner.pid
    }
    pub fn id(&self) -> &str {
        &self.inner.id
    }
    pub fn cwd(&self) -> &Path {
        &self.inner.cwd
    }
    pub fn control(&self) -> TerminalControl {
        TerminalControl {
            inner: self.inner.clone(),
        }
    }
    pub fn take_events(&mut self) -> Result<mpsc::Receiver<TerminalEvent>, TerminalError> {
        self.events
            .take()
            .ok_or_else(|| TerminalError::new(409, "Terminal events already have a reader"))
    }
    pub fn input(&self, bytes: &[u8]) -> Result<(), TerminalError> {
        self.control().input(bytes)
    }
    pub fn resize(&self, cols: u16, rows: u16) -> Result<(), TerminalError> {
        self.control().resize(cols, rows)
    }
    pub fn close(&self) {
        self.inner.close();
    }
}
impl Drop for TerminalSession {
    fn drop(&mut self) {
        self.close();
    }
}
impl TerminalControl {
    pub fn input(&self, bytes: &[u8]) -> Result<(), TerminalError> {
        if bytes.len() > MAX_INPUT_BYTES {
            return Err(TerminalError::new(
                413,
                "Terminal input frame exceeds 64 KiB",
            ));
        }
        if self.inner.closed.load(Ordering::Acquire) {
            return Err(TerminalError::new(410, "Terminal session is closed"));
        }
        #[cfg(windows)]
        {
            self.inner.native.input(bytes)
        }
        #[cfg(not(windows))]
        {
            let _ = bytes;
            Err(TerminalError::new(501, "ConPTY is unavailable"))
        }
    }
    pub fn resize(&self, cols: u16, rows: u16) -> Result<(), TerminalError> {
        dimensions(cols, rows)?;
        if self.inner.closed.load(Ordering::Acquire) {
            return Err(TerminalError::new(410, "Terminal session is closed"));
        }
        #[cfg(windows)]
        {
            self.inner.native.resize(cols, rows)
        }
        #[cfg(not(windows))]
        {
            Err(TerminalError::new(501, "ConPTY is unavailable"))
        }
    }
    pub fn close(&self) {
        self.inner.close();
    }
}
fn dimensions(cols: u16, rows: u16) -> Result<(), TerminalError> {
    if cols == 0 || rows == 0 || cols > 1000 || rows > 500 {
        Err(TerminalError::new(
            400,
            "Terminal dimensions must be 1..1000 columns and 1..500 rows",
        ))
    } else {
        Ok(())
    }
}

/// Binary input/output plus JSON resize match both shipped TerminalPanel builds.
pub async fn serve(socket: WebSocket, mut session: TerminalSession) {
    let Ok(mut events) = session.take_events() else {
        return;
    };
    let control = session.control();
    let (mut sink, mut stream) = socket.split();
    loop {
        tokio::select! {
            incoming=stream.next()=>{
                let Some(Ok(incoming))=incoming else{break;};
                let result=match incoming{
                    Message::Binary(bytes)=>{let control=control.clone();tokio::task::spawn_blocking(move||control.input(&bytes)).await.unwrap_or_else(|_|Err(TerminalError::new(500,"Terminal input worker failed")))},
                    Message::Text(text)=>{match serde_json::from_str::<Value>(&text){Ok(value) if value["type"]=="resize"=>{let cols=value["cols"].as_u64().and_then(|v|u16::try_from(v).ok());let rows=value["rows"].as_u64().and_then(|v|u16::try_from(v).ok());match (cols,rows){(Some(cols),Some(rows))=>control.resize(cols,rows),_=>Err(TerminalError::new(400,"Invalid terminal resize message"))}},Ok(value) if value["type"]=="close"=>{break;},_=>Err(TerminalError::new(400,"Terminal text frames must contain JSON resize controls"))}},
                    Message::Close(_)=>break,Message::Ping(data)=>{if sink.send(Message::Pong(data)).await.is_err(){break;}Ok(())},Message::Pong(_)=>Ok(()),
                };
                if let Err(error)=result{if sink.send(Message::Text(error.json().to_string())).await.is_err(){break;}}
            },
            event=events.recv()=>{match event{
                Some(TerminalEvent::Output(bytes))=>{if sink.send(Message::Binary(bytes)).await.is_err(){break;}},
                Some(TerminalEvent::Error(message))=>{let _=sink.send(Message::Text(json!({"type":"error","message":message}).to_string())).await;break;},
                Some(TerminalEvent::Exit(code))=>{let _=sink.send(Message::Text(json!({"type":"exit","exitCode":code}).to_string())).await;let _=sink.send(Message::Close(Some(CloseFrame{code:1000,reason:"Terminal process exited".into()}))).await;break;},None=>break,
            }}
        }
    }
    control.close();
    session.close();
}

#[cfg(windows)]
mod native {
    use super::*;
    use std::{
        fs::File,
        io::{Read, Write},
        mem::size_of,
        os::windows::{
            ffi::OsStrExt,
            io::{AsRawHandle, FromRawHandle, OwnedHandle},
        },
    };
    use windows_sys::Win32::{
        Foundation::{HANDLE, WAIT_OBJECT_0},
        System::{
            Console::{ClosePseudoConsole, CreatePseudoConsole, ResizePseudoConsole, COORD, HPCON},
            JobObjects::{
                AssignProcessToJobObject, CreateJobObjectW, JobObjectExtendedLimitInformation,
                SetInformationJobObject, JOBOBJECT_EXTENDED_LIMIT_INFORMATION,
                JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE,
            },
            Pipes::CreatePipe,
            Threading::{
                CreateProcessW, DeleteProcThreadAttributeList, GetExitCodeProcess,
                InitializeProcThreadAttributeList, ResumeThread, TerminateProcess,
                UpdateProcThreadAttribute, WaitForSingleObject, CREATE_SUSPENDED,
                CREATE_UNICODE_ENVIRONMENT, EXTENDED_STARTUPINFO_PRESENT, INFINITE,
                LPPROC_THREAD_ATTRIBUTE_LIST, PROCESS_INFORMATION,
                PROC_THREAD_ATTRIBUTE_PSEUDOCONSOLE, STARTF_USESTDHANDLES, STARTUPINFOEXW,
            },
        },
    };
    pub struct Native {
        pub pid: u32,
        input: Mutex<Option<File>>,
        console: Arc<Console>,
        job: Mutex<Option<OwnedHandle>>,
    }
    struct Console {
        handle: Mutex<Option<HPCON>>,
    }
    impl Console {
        fn close(&self) {
            let handle = self.handle.lock().unwrap().take();
            if let Some(handle) = handle {
                unsafe { ClosePseudoConsole(handle) }
            }
        }
        fn close_async(self: &Arc<Self>) {
            let console = self.clone();
            let _ = std::thread::Builder::new()
                .name("gamecowork-pty-close".into())
                .spawn(move || console.close());
        }
        fn resize(&self, cols: u16, rows: u16) -> Result<(), TerminalError> {
            let handle = self.handle.lock().unwrap();
            let handle =
                handle.ok_or_else(|| TerminalError::new(410, "Pseudo console is closed"))?;
            let result = unsafe {
                ResizePseudoConsole(
                    handle,
                    COORD {
                        X: cols as i16,
                        Y: rows as i16,
                    },
                )
            };
            hr(result, "resize pseudo console")
        }
    }
    impl Drop for Console {
        fn drop(&mut self) {
            self.close();
        }
    }
    struct Attributes {
        buffer: Vec<usize>,
        pointer: LPPROC_THREAD_ATTRIBUTE_LIST,
    }
    impl Attributes {
        fn new(console: HPCON) -> Result<Self, TerminalError> {
            let mut size = 0;
            unsafe { InitializeProcThreadAttributeList(std::ptr::null_mut(), 1, 0, &mut size) };
            if size == 0 {
                return Err(os_error("size process attributes"));
            }
            let mut buffer = vec![0usize; size.div_ceil(size_of::<usize>())];
            let pointer = buffer.as_mut_ptr().cast();
            if unsafe { InitializeProcThreadAttributeList(pointer, 1, 0, &mut size) } == 0 {
                return Err(os_error("initialize process attributes"));
            }
            let value = Self { buffer, pointer };
            if unsafe {
                UpdateProcThreadAttribute(
                    value.pointer,
                    0,
                    PROC_THREAD_ATTRIBUTE_PSEUDOCONSOLE as usize,
                    console as *const std::ffi::c_void,
                    size_of::<HPCON>(),
                    std::ptr::null_mut(),
                    std::ptr::null(),
                )
            } == 0
            {
                return Err(os_error("attach pseudo console attributes"));
            }
            Ok(value)
        }
    }
    impl Drop for Attributes {
        fn drop(&mut self) {
            unsafe { DeleteProcThreadAttributeList(self.pointer) };
            let _ = &self.buffer;
        }
    }
    fn owned(handle: HANDLE) -> Result<OwnedHandle, TerminalError> {
        if handle.is_null() {
            Err(os_error("create terminal handle"))
        } else {
            Ok(unsafe { OwnedHandle::from_raw_handle(handle) })
        }
    }
    fn pipe() -> Result<(OwnedHandle, OwnedHandle), TerminalError> {
        let (mut read, mut write) = (std::ptr::null_mut(), std::ptr::null_mut());
        if unsafe { CreatePipe(&mut read, &mut write, std::ptr::null(), 0) } == 0 {
            return Err(os_error("create terminal pipe"));
        }
        Ok((owned(read)?, owned(write)?))
    }
    fn hr(code: i32, operation: &str) -> Result<(), TerminalError> {
        if code < 0 {
            Err(TerminalError::new(
                500,
                format!("Cannot {operation}: HRESULT 0x{:08X}", code as u32),
            ))
        } else {
            Ok(())
        }
    }
    fn os_error(operation: &str) -> TerminalError {
        TerminalError::new(
            500,
            format!("Cannot {operation}: {}", std::io::Error::last_os_error()),
        )
    }
    fn job() -> Result<OwnedHandle, TerminalError> {
        let job = owned(unsafe { CreateJobObjectW(std::ptr::null(), std::ptr::null()) })?;
        let mut limits = JOBOBJECT_EXTENDED_LIMIT_INFORMATION::default();
        limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
        if unsafe {
            SetInformationJobObject(
                job.as_raw_handle(),
                JobObjectExtendedLimitInformation,
                &limits as *const _ as *const std::ffi::c_void,
                size_of::<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>() as u32,
            )
        } == 0
        {
            return Err(os_error("configure terminal lifetime job"));
        }
        Ok(job)
    }
    impl Native {
        pub fn spawn(
            cwd: &Path,
            cols: u16,
            rows: u16,
            events: mpsc::Sender<TerminalEvent>,
        ) -> Result<Self, TerminalError> {
            let (input_read, input_write) = pipe()?;
            let (output_read, output_write) = pipe()?;
            let mut pseudo = 0;
            hr(
                unsafe {
                    CreatePseudoConsole(
                        COORD {
                            X: cols as i16,
                            Y: rows as i16,
                        },
                        input_read.as_raw_handle(),
                        output_write.as_raw_handle(),
                        0,
                        &mut pseudo,
                    )
                },
                "create interactive pseudo console",
            )?;
            let console = Arc::new(Console {
                handle: Mutex::new(Some(pseudo)),
            });
            let attributes = Attributes::new(pseudo)?;
            let system_root = std::env::var_os("SystemRoot")
                .ok_or_else(|| TerminalError::new(500, "Windows SystemRoot is unavailable"))?;
            let executable =
                PathBuf::from(system_root).join("System32/WindowsPowerShell/v1.0/powershell.exe");
            if !executable.is_file() {
                return Err(TerminalError::new(
                    501,
                    "Windows PowerShell is unavailable for the interactive terminal",
                ));
            }
            let script="try { Set-PSReadLineOption -HistorySaveStyle SaveNothing -ErrorAction Stop } catch { Remove-Module PSReadLine -Force -ErrorAction SilentlyContinue }; $ProgressPreference='SilentlyContinue'; [Console]::OutputEncoding=[System.Text.UTF8Encoding]::new($false); [Console]::InputEncoding=[System.Text.UTF8Encoding]::new($false)";
            let line = format!(
                "\"{}\" -NoLogo -NoProfile -NoExit -Command \"{script}\"",
                executable.to_string_lossy()
            );
            let mut command = line.encode_utf16().chain(Some(0)).collect::<Vec<_>>();
            let application = executable
                .as_os_str()
                .encode_wide()
                .chain(Some(0))
                .collect::<Vec<_>>();
            let directory = crate::files::display(cwd)
                .replace('/', "\\")
                .encode_utf16()
                .chain(Some(0))
                .collect::<Vec<_>>();
            let mut startup = STARTUPINFOEXW::default();
            startup.StartupInfo.cb = size_of::<STARTUPINFOEXW>() as u32;
            // Redirected parent stdio can otherwise be duplicated into the
            // child despite ConPTY. Explicit null std handles let the console
            // loader create the PTY handles (Microsoft terminal #15814).
            startup.StartupInfo.dwFlags = STARTF_USESTDHANDLES;
            startup.lpAttributeList = attributes.pointer;
            let mut info = PROCESS_INFORMATION::default();
            let job = job()?;
            if unsafe {
                CreateProcessW(
                    application.as_ptr(),
                    command.as_mut_ptr(),
                    std::ptr::null(),
                    std::ptr::null(),
                    0,
                    EXTENDED_STARTUPINFO_PRESENT | CREATE_UNICODE_ENVIRONMENT | CREATE_SUSPENDED,
                    std::ptr::null(),
                    directory.as_ptr(),
                    &startup.StartupInfo,
                    &mut info,
                )
            } == 0
            {
                return Err(os_error("start interactive PowerShell"));
            }
            let process = Arc::new(owned(info.hProcess)?);
            let thread = owned(info.hThread)?;
            if unsafe { AssignProcessToJobObject(job.as_raw_handle(), process.as_raw_handle()) }
                == 0
            {
                unsafe { TerminateProcess(process.as_raw_handle(), 1) };
                return Err(os_error("protect terminal process lifetime"));
            }
            if unsafe { ResumeThread(thread.as_raw_handle()) } == u32::MAX {
                unsafe { TerminateProcess(process.as_raw_handle(), 1) };
                return Err(os_error("resume interactive terminal"));
            }
            drop(thread);
            drop(attributes);
            drop(input_read);
            drop(output_write);
            let input = File::from(input_write);
            let mut reader = File::from(output_read);
            let reader_process = process.clone();
            let output_events = events.clone();
            std::thread::Builder::new()
                .name("gamecowork-pty-output".into())
                .spawn(move || {
                    let mut chunk = [0u8; 8192];
                    let mut discard = false;
                    loop {
                        match reader.read(&mut chunk) {
                            Ok(0) => break,
                            Ok(n) => {
                                if !discard
                                    && output_events
                                        .blocking_send(TerminalEvent::Output(chunk[..n].to_vec()))
                                        .is_err()
                                {
                                    discard = true;
                                }
                            }
                            Err(error) => {
                                if error.raw_os_error() != Some(109) {
                                    let _ = output_events.blocking_send(TerminalEvent::Error(
                                        format!("Terminal output failed: {error}"),
                                    ));
                                }
                                break;
                            }
                        }
                    }
                    if unsafe { WaitForSingleObject(reader_process.as_raw_handle(), 5000) }
                        != WAIT_OBJECT_0
                    {
                        let _ = output_events.blocking_send(TerminalEvent::Error(
                            "PTY output closed before its shell exited".into(),
                        ));
                        return;
                    }
                    let mut code = 1;
                    unsafe { GetExitCodeProcess(reader_process.as_raw_handle(), &mut code) };
                    let _ = output_events.blocking_send(TerminalEvent::Exit(code as i32));
                })
                .map_err(|e| {
                    TerminalError::new(500, format!("Cannot start PTY output reader: {e}"))
                })?;
            let exit_console = console.clone();
            std::thread::Builder::new()
                .name("gamecowork-pty-wait".into())
                .spawn(move || {
                    if unsafe { WaitForSingleObject(process.as_raw_handle(), INFINITE) }
                        == WAIT_OBJECT_0
                    {
                        exit_console.close();
                    }
                })
                .map_err(|e| {
                    TerminalError::new(500, format!("Cannot watch PTY process exit: {e}"))
                })?;
            Ok(Self {
                pid: info.dwProcessId,
                input: Mutex::new(Some(input)),
                console,
                job: Mutex::new(Some(job)),
            })
        }
        pub fn input(&self, bytes: &[u8]) -> Result<(), TerminalError> {
            let mut input = self.input.lock().unwrap();
            let file = input
                .as_mut()
                .ok_or_else(|| TerminalError::new(410, "Terminal input is closed"))?;
            file.write_all(bytes)
                .and_then(|_| file.flush())
                .map_err(|e| TerminalError::new(500, format!("PTY input failed: {e}")))
        }
        pub fn resize(&self, cols: u16, rows: u16) -> Result<(), TerminalError> {
            self.console.resize(cols, rows)
        }
        pub fn close(&self) {
            self.job.lock().unwrap().take();
            self.console.close_async();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn invalid_dimensions_do_not_start_a_shell() {
        assert!(dimensions(0, 24).is_err());
        assert!(dimensions(80, 0).is_err());
        assert!(dimensions(1001, 24).is_err());
        assert!(dimensions(80, 24).is_ok());
    }
    #[test]
    fn caller_grants_cwd_not_client_path() {
        let root = PathBuf::from(
            r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
        )
        .join(format!("terminal-scope-{}", Uuid::new_v4()));
        let allowed = root.join("allowed");
        let outside = root.join("outside");
        std::fs::create_dir_all(&allowed).unwrap();
        std::fs::create_dir_all(&outside).unwrap();
        let result = TerminalSession::spawn(&outside, &[allowed], 80, 24);
        assert!(matches!(result, Err(TerminalError { status: 403, .. })));
        let canonical = std::fs::canonicalize(&root).unwrap();
        let base = std::fs::canonicalize(
            r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
        )
        .unwrap();
        assert!(crate::files::within(&canonical, &base));
        std::fs::remove_dir_all(canonical).unwrap();
    }

    #[cfg(windows)]
    #[tokio::test(flavor = "multi_thread")]
    async fn real_conpty_executes_input_resizes_and_reports_actual_exit() {
        let base = PathBuf::from(
            r"F:\AI\AgentMake\CyberSoftwares\GameCowork\codelyreversebackup\work\tests",
        );
        let root = base.join(format!("terminal-interactive-{}", Uuid::new_v4()));
        std::fs::create_dir_all(&root).unwrap();
        let mut session = TerminalSession::spawn(&root, &[root.clone()], 80, 24).unwrap();
        let mut events = session.take_events().unwrap();
        let mut output = String::new();
        session.input(b"$v='EXEC'+'UTED';[IO.File]::WriteAllText('own-fixture.txt',$v);echo ('PTY_'+'COMPLETE')\r").unwrap();
        let deadline = tokio::time::Instant::now() + std::time::Duration::from_secs(15);
        while !output.contains("PTY_COMPLETE") {
            match tokio::time::timeout_at(deadline, events.recv())
                .await
                .expect("PTY command deadline")
                .expect("PTY output")
            {
                TerminalEvent::Output(bytes) => {
                    let chunk = String::from_utf8_lossy(&bytes);
                    if chunk.contains("\x1b[6n") {
                        session.input(b"\x1b[1;1R").unwrap();
                    }
                    output.push_str(&chunk);
                }
                TerminalEvent::Error(error) => panic!("{error}"),
                TerminalEvent::Exit(code) => panic!("Shell exited early: {code}"),
            }
        }
        assert_eq!(
            std::fs::read(root.join("own-fixture.txt")).unwrap(),
            b"EXECUTED"
        );
        session.resize(100, 35).unwrap();
        session
            .input(b"echo ('SIZE_'+[Console]::WindowWidth+'x'+[Console]::WindowHeight)\r")
            .unwrap();
        let deadline = tokio::time::Instant::now() + std::time::Duration::from_secs(10);
        while !output.contains("SIZE_100x35") {
            match tokio::time::timeout_at(deadline, events.recv())
                .await
                .expect("PTY resize deadline")
                .expect("PTY output")
            {
                TerminalEvent::Output(bytes) => output.push_str(&String::from_utf8_lossy(&bytes)),
                TerminalEvent::Error(error) => panic!("{error}"),
                TerminalEvent::Exit(code) => panic!("Shell exited early: {code}"),
            }
        }
        session.input(b"exit 7\r").unwrap();
        let deadline = tokio::time::Instant::now() + std::time::Duration::from_secs(10);
        loop {
            match tokio::time::timeout_at(deadline, events.recv())
                .await
                .expect("PTY exit deadline")
                .expect("PTY output")
            {
                TerminalEvent::Exit(code) => {
                    assert_eq!(code, 7);
                    break;
                }
                TerminalEvent::Error(error) => panic!("{error}"),
                TerminalEvent::Output(_) => {}
            }
        }
        session.close();
        assert!(session.input(b"echo no\r").is_err());
        drop(session);
        let canonical = std::fs::canonicalize(&root).unwrap();
        let base = std::fs::canonicalize(base).unwrap();
        assert!(crate::files::within(&canonical, &base));
        std::fs::remove_dir_all(canonical).unwrap();
    }
}
