//! Keeps only the shell's spawned core and its subsequent descendants in an
//! unnamed Windows Job. Windows closes the non-inheritable job handle when the
//! shell exits, including forced termination where Rust Drop does not execute.

#[cfg(windows)]
use std::{
    os::windows::io::{AsRawHandle, FromRawHandle, OwnedHandle},
    sync::Arc,
};

#[derive(Clone)]
pub struct ProcessLifetime {
    #[cfg(windows)]
    _job: Arc<OwnedHandle>,
}

impl ProcessLifetime {
    /// Call immediately after spawning the core, before using it. On failure the
    /// caller must terminate that exact child and fail startup; protection is
    /// never advertised when Windows declined job creation or assignment.
    pub fn attach(child: &tokio::process::Child) -> Result<Self, String> {
        #[cfg(windows)]
        {
            use windows_sys::Win32::System::JobObjects::{
                AssignProcessToJobObject, CreateJobObjectW, JobObjectExtendedLimitInformation,
                SetInformationJobObject, JOBOBJECT_EXTENDED_LIMIT_INFORMATION,
                JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE,
            };

            let process = child
                .raw_handle()
                .ok_or_else(|| "Cannot protect core lifetime: child has exited".to_string())?;
            // Null security attributes make the handle non-inheritable. Null
            // name creates a fresh job rather than opening a shared named job.
            let raw_job = unsafe { CreateJobObjectW(std::ptr::null(), std::ptr::null()) };
            if raw_job.is_null() {
                return Err(win_error("create core lifetime job"));
            }
            // Ownership is transferred exactly once after successful creation.
            let job = unsafe { OwnedHandle::from_raw_handle(raw_job) };
            let mut limits = JOBOBJECT_EXTENDED_LIMIT_INFORMATION::default();
            limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
            let configured = unsafe {
                SetInformationJobObject(
                    job.as_raw_handle(),
                    JobObjectExtendedLimitInformation,
                    &limits as *const _ as *const std::ffi::c_void,
                    std::mem::size_of::<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>() as u32,
                )
            };
            if configured == 0 {
                return Err(win_error("configure core lifetime job"));
            }
            // This receives the handle of the child we just spawned. It never
            // discovers, opens, or terminates processes by executable name.
            if unsafe { AssignProcessToJobObject(job.as_raw_handle(), process) } == 0 {
                return Err(win_error("assign spawned core to lifetime job"));
            }
            Ok(Self {
                _job: Arc::new(job),
            })
        }
        #[cfg(not(windows))]
        {
            let _ = child;
            Ok(Self {})
        }
    }
}

#[cfg(windows)]
fn win_error(operation: &str) -> String {
    format!("Cannot {operation}: {}", std::io::Error::last_os_error())
}
