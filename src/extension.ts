import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as os from 'os';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.copyAsFile', (uri?: vscode.Uri) => {
        if (!uri) {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                uri = activeEditor.document.uri;
            }
        }

        if (!uri || uri.scheme !== 'file') {
            vscode.window.showErrorMessage('请在左侧选中或打开一个本地文件');
            return;
        }

        const filePath = uri.fsPath;
        const platform = os.platform();
        let cmd = '';

        if (platform === 'win32') {
            const safePath = filePath.replace(/'/g, "''");
            cmd = `powershell.exe -NoProfile -WindowStyle Hidden -Command "Set-Clipboard -Path '${safePath}'"`;
        } else if (platform === 'linux') {
            const fileUri = `file://${filePath}`;
            cmd = `if command -v wl-copy >/dev/null 2>&1; then echo -n "${fileUri}" | wl-copy -t text/uri-list; elif command -v xclip >/dev/null 2>&1; then echo -n "${fileUri}" | xclip -selection clipboard -t text/uri-list; else exit 255; fi`;
        } else if (platform === 'darwin') {
            const macSafePath = filePath.replace(/"/g, '\\"').replace(/'/g, "'\\''");
            cmd = `osascript -e 'set the clipboard to POSIX file "${macSafePath}"'`;
        } else {
            vscode.window.showErrorMessage(`暂不支持的操作系统: ${platform}`);
            return;
        }

        exec(cmd, (error) => {
            if (error) {

                if (platform === 'linux' && error.code === 255) {
                    vscode.window.showErrorMessage('复制失败：您似乎未安装安装 xclip 或 wl-clipboard');
                } else {
                    vscode.window.showErrorMessage(`复制失败: ${error.message}`);
                }
                return;
            }
            vscode.window.setStatusBarMessage(`$(check) 已复制 [${filePath.split(/\\|\//).pop()}] 到剪贴板`, 3000);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}