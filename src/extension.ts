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
            vscode.window.showErrorMessage(vscode.l10n.t('Please select or open a local file on the left'));
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
            vscode.window.showErrorMessage(vscode.l10n.t('Unsupported operating system: {0}', platform));
            return;
        }

        exec(cmd, (error) => {
            if (error) {
                if (platform === 'linux' && error.code === 255) {
                    vscode.window.showErrorMessage(vscode.l10n.t('Copy failed: It seems you have not installed xclip or wl-clipboard'));
                } else {
                    vscode.window.showErrorMessage(vscode.l10n.t('Copy failed: {0}', error.message));
                }
                return;
            }
            const fileName = filePath.split(/\\|\//).pop() || '';
            vscode.window.setStatusBarMessage(vscode.l10n.t('$(check) Copied [{0}] to clipboard', fileName), 3000);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}