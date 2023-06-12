import { app } from 'electron';
import log from 'electron-log';
import path from 'node:path';
import fs from 'fs';

function domReady(
    condition: DocumentReadyState[] = ['complete', 'interactive']
) {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find((e) => e === child)) {
            return parent.appendChild(child);
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find((e) => e === child)) {
            return parent.removeChild(child);
        }
    },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
    const className = `loaders-css__square-spin`;
    const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
    const oStyle = document.createElement('style');
    const oDiv = document.createElement('div');

    oStyle.id = 'app-loading-style';
    oStyle.innerHTML = styleContent;
    oDiv.className = 'app-loading-wrap';
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle);
            safeDOM.append(document.body, oDiv);
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle);
            safeDOM.remove(document.body, oDiv);
        },
    };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
    ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);

// ! Working with informations from the main process and the renderer process
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getMedia: () => {
        return new Promise((resolve, reject) => {
            ipcRenderer
                .invoke('get-screens')
                .then((media) => {
                    resolve(media);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    saveLog: (
        message: string,
        level: ElectronLogLevel = ElectronLogLevel.INFO,
        logFileName: string
    ) => {
        //github.com/finos/SymphonyElectron/blob/0431a9f5add13cd16c19006775f1e907f3c3b2ce/src/common/logger.ts#L66
        const logDirectoryPath = path.join(app.getPath('exe'), 'logs');

        // Create the log directory if it doesn't exist
        if (!fs.existsSync(logDirectoryPath)) {
            fs.mkdirSync(logDirectoryPath);
        }

        const logFilePath = path.join(logDirectoryPath, logFileName);

        try {
            // Save log message using electron-log
            log.transports.file.resolvePath = () => logFilePath;
            log[level](message);

            return { success: true, message: message };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error saving log file.' };
        }

        // const logDirecotryName = 'logs';

        // console.log(process.env.NODE_ENV);

        // log.transports.file.format = '[{h}:{i}:{s}:{ms}] [{level}] {text}';
        // log.transports.file.maxSize = 5 * 1024 * 1024; // 5 MB

        // if (process.env.NODE_ENV === 'development') {
        //     // Set the desired log file name
        //     log.transports.file.resolvePath = () =>
        //         path.join(logDirecotryName, logFileName);

        //     // Save log message using electron-log
        //     log[level](message);
        // } else {
        //     // TODO: cant save log file in the root directory of the installed application yet
        //     // Set the desired log file name in the root directory of the installed application
        //     const logFilePath = path.join(app.getPath('exe'), logFileName);
        //     log.transports.file.resolvePath = () => logFilePath;

        //     // Save log message using electron-log
        //     log[level](message);
        // }
    },
});

/**
 * Electron log levels enum declaration
 */
export enum ElectronLogLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
    SILLY = 'silly',
}
