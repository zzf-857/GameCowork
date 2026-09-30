// Tuanjie Cowork (GameCowork) 桌面壳 — 逆向重建骨架
// 依据: cowork.exe v2.1.3-canary.2 二进制分析（见 COMMAND_SURFACE.md）
// 结论: 原版未注册自定义 invoke 命令，是纯"窗口/托盘/更新"壳；
//       本文件为可编译的结构示意，非逐函数还原。

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {
            // single-instance: 二次启动聚焦已有实例
        }))
        .plugin(tauri_plugin_updater::Builder::new().build())
        // 更新清单: https://update.gamecowork.invalid/plugins/cowork/latest (.invalid 占位域=更新物理断开, 见 PACKAGING.md)
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            // TODO(还原位): 启动 core 边车 gamecowork-binary.exe（HTTP 服务）
            //   进程名隔离: 原版为 codely-binary.exe, 打包装配时必须用改名后的二进制(见 PACKAGING.md)
            // TODO(还原位): 创建 gui.html / pet.html / windowBridge.html 等运行期窗口
            // TODO(还原位): 托盘菜单（二进制观察到大量 plugin:menu|set / plugin:tray|set 调用）
            // TODO(还原位): gamecowork-process-killer.exe 伴生进程的拉起与回收
            // TODO(还原位): 单实例/锁文件实现时用 lock.gamecowork.lock(原版为 lock.codely.lock, 勿复用)
            let _ = app;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running GameCowork");
}
