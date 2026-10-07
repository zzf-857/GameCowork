// Codely main-account host support. The Core account broker keeps plaintext
// tokens in its own process and delegates at-rest protection to this DPAPI
// vault over the core stdio channel; hex framing keeps secrets off command
// lines and out of logs. External HTTPS pages (device-verification, links)
// open in the system browser instead of replacing or forking the app webview.
use serde_json::{json, Value};

const VAULT_MAGIC: &[u8] = b"GCWK";
const VAULT_VERSION: u8 = 1;
const MAX_SECRET_BYTES: usize = 64 * 1024;

fn hex_encode(bytes: &[u8]) -> String {
    let mut out = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        out.push_str(&format!("{byte:02x}"));
    }
    out
}

fn hex_decode(text: &str) -> Result<Vec<u8>, String> {
    let text = text.trim();
    if text.len() % 2 != 0 || !text.bytes().all(|b| b.is_ascii_hexdigit()) {
        return Err("Invalid hex payload".into());
    }
    let mut out = Vec::with_capacity(text.len() / 2);
    let bytes = text.as_bytes();
    for pair in bytes.chunks_exact(2) {
        let high = (pair[0] as char)
            .to_digit(16)
            .ok_or("Invalid hex payload")?;
        let low = (pair[1] as char)
            .to_digit(16)
            .ok_or("Invalid hex payload")?;
        out.push(((high << 4) | low) as u8);
    }
    Ok(out)
}

fn vault_payload(data: &Value, field: &str) -> Result<Vec<u8>, String> {
    let text = data[field]
        .as_str()
        .ok_or_else(|| format!("Vault request field {field} is required"))?;
    let bytes = hex_decode(text)?;
    if bytes.len() > MAX_SECRET_BYTES {
        return Err("Vault payload exceeds size limit".into());
    }
    Ok(bytes)
}

#[cfg(windows)]
fn dpapi_protect(plain: &[u8]) -> Result<Vec<u8>, String> {
    use windows_sys::Win32::Foundation::{LocalFree, HLOCAL};
    use windows_sys::Win32::Security::Cryptography::{
        CryptProtectData, CRYPTPROTECT_UI_FORBIDDEN, CRYPT_INTEGER_BLOB,
    };
    unsafe {
        let input = CRYPT_INTEGER_BLOB {
            cbData: plain.len() as u32,
            pbData: plain.as_ptr() as *mut u8,
        };
        let mut output = CRYPT_INTEGER_BLOB {
            cbData: 0,
            pbData: std::ptr::null_mut(),
        };
        let description: Vec<u16> = "GameCowork Codely account\0".encode_utf16().collect();
        let ok = CryptProtectData(
            &input,
            description.as_ptr(),
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null(),
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut output,
        );
        if ok == 0 {
            return Err("CryptProtectData failed".into());
        }
        let blob = std::slice::from_raw_parts(output.pbData, output.cbData as usize);
        let result = blob.to_vec();
        LocalFree(output.pbData as HLOCAL);
        Ok(result)
    }
}

#[cfg(windows)]
fn dpapi_unprotect(blob: &[u8]) -> Result<Vec<u8>, String> {
    use windows_sys::Win32::Foundation::{LocalFree, HLOCAL};
    use windows_sys::Win32::Security::Cryptography::{
        CryptUnprotectData, CRYPTPROTECT_UI_FORBIDDEN, CRYPT_INTEGER_BLOB,
    };
    unsafe {
        let input = CRYPT_INTEGER_BLOB {
            cbData: blob.len() as u32,
            pbData: blob.as_ptr() as *mut u8,
        };
        let mut output = CRYPT_INTEGER_BLOB {
            cbData: 0,
            pbData: std::ptr::null_mut(),
        };
        let mut description: windows_sys::core::PWSTR = std::ptr::null_mut();
        let ok = CryptUnprotectData(
            &input,
            &mut description,
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null(),
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut output,
        );
        if ok == 0 {
            return Err("CryptUnprotectData failed".into());
        }
        if !description.is_null() {
            LocalFree(description as HLOCAL);
        }
        let plain = std::slice::from_raw_parts(output.pbData, output.cbData as usize).to_vec();
        LocalFree(output.pbData as HLOCAL);
        Ok(plain)
    }
}

fn framed(blob: Vec<u8>) -> Vec<u8> {
    let mut out = Vec::with_capacity(VAULT_MAGIC.len() + 1 + blob.len());
    out.extend_from_slice(VAULT_MAGIC);
    out.push(VAULT_VERSION);
    out.extend_from_slice(&blob);
    out
}

/// Seals bytes into a versioned DPAPI blob. Non-Windows hosts fail honestly;
/// the broker refuses to run without a working vault.
pub fn vault_seal(plain: &[u8]) -> Result<Vec<u8>, String> {
    if plain.len() > MAX_SECRET_BYTES {
        return Err("Vault payload exceeds size limit".into());
    }
    #[cfg(windows)]
    {
        Ok(framed(dpapi_protect(plain)?))
    }
    #[cfg(not(windows))]
    {
        let _ = plain;
        Err("DPAPI vault requires Windows".into())
    }
}

/// Unseals a versioned DPAPI blob, rejecting foreign framing before DPAPI.
pub fn vault_unseal(blob: &[u8]) -> Result<Vec<u8>, String> {
    if blob.len() < VAULT_MAGIC.len() + 1 {
        return Err("Vault blob is truncated".into());
    }
    if &blob[..VAULT_MAGIC.len()] != VAULT_MAGIC {
        return Err("Vault blob has unknown framing".into());
    }
    if blob[VAULT_MAGIC.len()] != VAULT_VERSION {
        return Err("Vault blob version is unsupported".into());
    }
    #[cfg(windows)]
    {
        dpapi_unprotect(&blob[VAULT_MAGIC.len() + 1..])
    }
    #[cfg(not(windows))]
    {
        let _ = blob;
        Err("DPAPI vault requires Windows".into())
    }
}

/// Host-side handler for the broker's vault requests over core stdio.
pub fn vault_host_response(kind: &str, data: &Value) -> Value {
    match kind {
        "gamecoworkAccount/vaultSeal" => {
            match vault_payload(data, "data").and_then(|plain| vault_seal(&plain)) {
                Ok(sealed) => json!({"sealed": hex_encode(&sealed)}),
                Err(error) => {
                    json!({"__gamecoworkHostError": {"message": error, "code": "VAULT_SEAL_FAILED"}})
                }
            }
        }
        "gamecoworkAccount/vaultUnseal" => {
            match vault_payload(data, "data").and_then(|blob| vault_unseal(&blob)) {
                Ok(plain) => json!({"plain": hex_encode(&plain)}),
                Err(error) => {
                    json!({"__gamecoworkHostError": {"message": error, "code": "VAULT_UNSEAL_FAILED"}})
                }
            }
        }
        _ => {
            json!({"__gamecoworkHostError": {"message": "Unknown vault request", "code": "VAULT_UNKNOWN"}})
        }
    }
}

pub fn is_vault_request(kind: &str) -> bool {
    matches!(
        kind,
        "gamecoworkAccount/vaultSeal" | "gamecoworkAccount/vaultUnseal"
    )
}

/// Screens a URL for external HTTP(S) opening. Pure function so tests never
/// launch a browser; windows.open/navigation handlers pair it with open_in_shell.
pub fn is_external_http_https(url: &str) -> bool {
    if url.len() > 8192 || url.chars().any(|c| c.is_control() || c.is_whitespace()) {
        return false;
    }
    let lower = url.to_ascii_lowercase();
    let scheme_ok = lower.starts_with("https://") || lower.starts_with("http://");
    if !scheme_ok {
        return false;
    }
    let rest = &url[url.find("://").unwrap() + 3..];
    let authority = rest.split(['/', '?', '#']).next().unwrap_or("");
    if authority.is_empty() || authority.contains(['\\', '@']) {
        return false;
    }
    true
}

// The original login link posts controlPlane/openBrowser, which becomes a
// Core -> host openUrl request. Navigation handlers alone never see that link.
pub fn open_url_host_response(data: &Value, suppressed: bool) -> Value {
    open_url_response_with(data, suppressed, open_external_https)
}

fn open_url_response_with(
    data: &Value,
    suppressed: bool,
    opener: impl FnOnce(&str) -> bool,
) -> Value {
    let Some(url) = data.as_str().filter(|url| is_external_http_https(url)) else {
        return json!({"__gamecoworkHostError": {"code": "INVALID_EXTERNAL_URL", "message": "Only valid HTTP(S) browser links are supported"}});
    };
    if suppressed {
        return json!({"opened": false, "suppressed": true});
    }
    if opener(url) {
        json!({"opened": true, "suppressed": false})
    } else {
        json!({"__gamecoworkHostError": {"code": "BROWSER_OPEN_FAILED", "message": "Cannot open the system browser"}})
    }
}

/// Opens an external HTTP(S) URL in the system browser. Used by the webview
/// new-window and navigation handlers so official verification pages never
/// replace the app UI. Returns false when the URL was rejected.
pub fn open_external_https(url: &str) -> bool {
    if !is_external_http_https(url) {
        return false;
    }
    open_in_shell(url)
}

#[cfg(windows)]
fn open_in_shell(url: &str) -> bool {
    use windows_sys::Win32::UI::Shell::ShellExecuteW;
    use windows_sys::Win32::UI::WindowsAndMessaging::SW_SHOWNORMAL;
    let file: Vec<u16> = url.encode_utf16().chain(std::iter::once(0)).collect();
    let operation: Vec<u16> = "open\0".encode_utf16().collect();
    let result = unsafe {
        ShellExecuteW(
            std::ptr::null_mut(),
            operation.as_ptr(),
            file.as_ptr(),
            std::ptr::null(),
            std::ptr::null(),
            SW_SHOWNORMAL,
        )
    };
    result as isize > 32
}

#[cfg(not(windows))]
fn open_in_shell(_url: &str) -> bool {
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hex_round_trip_and_rejects() {
        assert_eq!(hex_encode(&[0x00, 0xff, 0x10]), "00ff10");
        assert_eq!(hex_decode("00ff10").unwrap(), vec![0x00, 0xff, 0x10]);
        assert!(hex_decode("0").is_err());
        assert!(hex_decode("zz").is_err());
        assert!(hex_decode("00f").is_err());
    }

    #[cfg(windows)]
    #[test]
    fn dpapi_vault_round_trip_and_framing() {
        let secret = b"access-token-sample-bytes".to_vec();
        let sealed = vault_seal(&secret).unwrap();
        assert_ne!(sealed, secret);
        assert_eq!(&sealed[..4], VAULT_MAGIC);
        assert_eq!(sealed[4], VAULT_VERSION);
        assert_eq!(vault_unseal(&sealed).unwrap(), secret);
        let foreign = {
            let mut blob = sealed.clone();
            blob[4] = 9;
            blob
        };
        assert!(vault_unseal(&foreign).is_err());
        assert!(vault_unseal(&sealed[2..]).is_err());
        assert!(vault_unseal(b"nonsense").is_err());
    }

    #[cfg(windows)]
    #[test]
    fn vault_host_response_envelope() {
        let plain = b"refresh-token-sample".to_vec();
        let sealed = vault_seal(&plain).unwrap();
        let sealed_hex = hex_encode(&sealed);
        let reply = vault_host_response(
            "gamecoworkAccount/vaultUnseal",
            &json!({"data": sealed_hex}),
        );
        assert_eq!(hex_decode(reply["plain"].as_str().unwrap()).unwrap(), plain);
        let reply = vault_host_response(
            "gamecoworkAccount/vaultSeal",
            &json!({"data": hex_encode(&plain)}),
        );
        assert_eq!(
            vault_unseal(&hex_decode(reply["sealed"].as_str().unwrap()).unwrap()).unwrap(),
            plain
        );
        let bad = vault_host_response("gamecoworkAccount/vaultUnseal", &json!({"data": "%%"}));
        assert!(bad["__gamecoworkHostError"].is_object());
        let missing = vault_host_response("gamecoworkAccount/vaultSeal", &json!({}));
        assert!(missing["__gamecoworkHostError"].is_object());
    }

    #[test]
    fn external_urls_are_screened() {
        assert!(is_external_http_https(
            "https://codely.tuanjie.cn/auth/device?user_code=ABCD-EFGH"
        ));
        assert!(is_external_http_https("http://example.invalid/page"));
        assert!(!is_external_http_https(
            "file:///C:/Windows/System32/calc.exe"
        ));
        assert!(!is_external_http_https("javascript:alert(1)"));
        assert!(!is_external_http_https("not a url"));
        assert!(!is_external_http_https("ftp://example.invalid/file"));
        assert!(!is_external_http_https("https://\\evil.invalid"));
        assert!(!is_external_http_https("https://example.invalid/\0file"));
        assert!(!is_external_http_https("https://user@example.invalid/"));
        assert!(!is_external_http_https("https://exa mple.invalid/"));
    }

    #[test]
    fn browser_rpc_dispatches_valid_links_and_reports_failures() {
        let url = "https://codely.tuanjie.cn/auth/device?user_code=ABCD-EFGH";
        let opened = open_url_response_with(&json!(url), false, |actual| {
            assert_eq!(actual, url);
            true
        });
        assert_eq!(opened, json!({"opened": true, "suppressed": false}));
        let failed = open_url_response_with(&json!(url), false, |_| false);
        assert_eq!(
            failed["__gamecoworkHostError"]["code"],
            "BROWSER_OPEN_FAILED"
        );
        let suppressed = open_url_response_with(&json!(url), true, |_| panic!("must not launch"));
        assert_eq!(suppressed, json!({"opened": false, "suppressed": true}));
        for value in [
            json!("file:///C:/Windows/System32/calc.exe"),
            json!({"url":url}),
            Value::Null,
        ] {
            let rejected = open_url_response_with(&value, false, |_| panic!("must reject"));
            assert_eq!(
                rejected["__gamecoworkHostError"]["code"],
                "INVALID_EXTERNAL_URL"
            );
        }
    }
}
