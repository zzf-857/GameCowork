// Native caption support is scoped to this application's own main window.
// WM_NCLBUTTONDOWN takes packed signed coordinates, not a POINTS pointer.
#[cfg(windows)]
fn packed_point(x: i32, y: i32) -> isize {
    ((x as u16 as u32) | ((y as u16 as u32) << 16)) as isize
}
pub fn start_dragging(window: &tao::window::Window) -> Result<(), String> {
    #[cfg(windows)]
    {
        use tao::platform::windows::WindowExtWindows;
        use windows_sys::Win32::{
            Foundation::POINT,
            UI::{
                Input::KeyboardAndMouse::{
                    GetAsyncKeyState, ReleaseCapture, VK_LBUTTON, VK_RBUTTON,
                },
                WindowsAndMessaging::{
                    GetCursorPos, GetSystemMetrics, PostMessageW, HTCAPTION, SM_SWAPBUTTON,
                    WM_NCLBUTTONDOWN,
                },
            },
        };
        let mut point = POINT { x: 0, y: 0 };
        unsafe {
            let primary = if GetSystemMetrics(SM_SWAPBUTTON) != 0 {
                VK_RBUTTON
            } else {
                VK_LBUTTON
            };
            if GetAsyncKeyState(primary as i32) as u16 & 0x8000 == 0 {
                return Ok(());
            }
            if GetCursorPos(&mut point) == 0 {
                return Err(std::io::Error::last_os_error().to_string());
            }
            ReleaseCapture();
            if PostMessageW(
                window.hwnd() as _,
                WM_NCLBUTTONDOWN,
                HTCAPTION as _,
                packed_point(point.x, point.y),
            ) == 0
            {
                return Err(std::io::Error::last_os_error().to_string());
            }
        }
        Ok(())
    }
    #[cfg(not(windows))]
    {
        window.drag_window().map_err(|error| error.to_string())
    }
}
#[cfg(all(test, windows))]
mod tests {
    use super::*;
    #[test]
    fn caption_lparam_packs_signed_multi_monitor_coordinates_by_value() {
        for (x, y) in [(0, 0), (1454, 937), (-1200, 500), (50, -900), (-300, -400)] {
            let value = packed_point(x, y) as u32;
            assert_eq!(value as u16 as i16 as i32, x);
            assert_eq!((value >> 16) as u16 as i16 as i32, y);
        }
    }
}
