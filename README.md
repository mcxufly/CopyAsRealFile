# Copy as File (复制为真实文件)

> A lightweight, cross-platform plugin for copying VSCode/VSCodium files to clipboard as a real file (CF_HDROP or URL with MIME), allowing you to paste them directly into your OS file manager or other applications.

一个跨平台的轻量级插件，用于将 VS Code / VSCodium 中的文件作为“真实文件”复制到系统剪贴板。有别于仅复制文件路径文本，使用本插件复制后，你可以直接将文件**粘贴**到操作系统的文件管理器或其他支持接收文件的聊天软件，尤其是本来不被支持的浏览器内核软件中。

## 使用方法

你可以通过以下三种方式触发“复制文件”命令：

1.  **右键菜单**：
    在左侧的文件资源管理器中，右键点击任意文件，选择 **`复制为真实文件 (Copy as File)`**。
2.  **快捷键**：
    * Windows / Linux: 按下 `Ctrl + Alt + C`
    * macOS: 按下 `Cmd + Alt + C`
3.  **命令面板**：
    按下 `F1` 或 `Ctrl+Shift+P` 打开命令面板，输入 `Copy as File` 并回车。

## 系统要求

为了让剪贴板功能正常工作，不同操作系统有以下要求：

* **Windows**: 开箱即用。
* **macOS**: 开箱即用。
* **Linux**: 必须安装剪贴板工具。插件会尝试使用 `wl-copy` 或 `xclip`。如果你的系统未安装它们，插件将无法工作并会弹出报错提示。
    * Ubuntu / Debian 安装命令:
        ```bash
        sudo apt install xclip wl-clipboard
        ```
    * Arch Linux 安装命令:
        ```bash
        sudo pacman -S xclip wl-clipboard
        ```

## 已知问题

* 暂不支持同时选中多个文件进行批量复制。
* 在部分 Linux 发行版中，可能需要手动确保系统支持剪贴板 API。

## 发行说明

### 0.0.5
* 初始版本发布。
* 支持 Windows (CF_HDROP), macOS (POSIX file) 以及 Linux (URI list) 的剪贴板文件写入。
* 添加快捷键与右键菜单支持。

---
**Enjoy!**

Write by [DrCMWither](https://github.com/DrCMWither)