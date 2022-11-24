// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : join(process.env.DIST_ELECTRON, '../public');

import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { release } from 'os';
import { join } from 'path';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
    win = new BrowserWindow({
        title: 'Main window',
        minWidth: 800,
        minHeight: 500,
        frame: true, // still buggy cant select items from the custom titlebar
        autoHideMenuBar: true,
        icon: join(process.env.PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: true, // protect against prototype pollution
        },
    });

    const remoteMain = require('@electron/remote/main');
    remoteMain.initialize();

    if (app.isPackaged) {
        win.loadFile(indexHtml);
    } else {
        win.loadURL(url);
        // Open devTool if the app is not packaged
        win.webContents.openDevTools();
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            new Date().toLocaleString()
        );
        win.setTitle(`Vigad v${1.0}`);
    });

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
    });

    remoteMain.enable(win.webContents);

    // Get all screens/windows from the main process to the renderer process
    ipcMain.handle('get-screens', getScreen);
    ipcMain.handle('minimize-screen', () => {
        win.minimize();
    });
    ipcMain.handle('full-screen', () => {
        win.isMaximized() ? win.restore() : win.maximize();
    });
    ipcMain.handle('close-application', () => {
        win.close();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    win = null;
    if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
        },
    });

    if (app.isPackaged) {
        childWindow.loadFile(indexHtml, { hash: arg });
    } else {
        childWindow.loadURL(`${url}/#${arg}`);
        // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
    }
});

async function getScreen(event, title) {
    // In the main process.
    const { desktopCapturer } = require('electron');

    const allSources = await desktopCapturer.getSources({
        types: ['window', 'screen'],
    });

    // const videoOptionsMenu = Menu.buildFromTemplate([
    //   allSources.map((source) => {
    //     return {
    //       label: source.name,
    //       click: () => selectSource(source),
    //     }
    //   }),
    // ])

    // videoOptionsMenu.popup()
    return allSources;
}
