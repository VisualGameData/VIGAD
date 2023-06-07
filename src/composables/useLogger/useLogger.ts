import { ref } from 'vue';
import { Logger } from 'tslog';
import { ElectronLogLevel } from './electron-log-level';

/**
 * Create a logger instance
 * @type {Logger}
 */
const logger = new Logger();

/**
 * Reference to the electron logger in the main process
 * @type {any}
 */
const electronLogger = (window as any).electronAPI;

/**
 * Logger composable
 */
export default function useLogger() {
    const logMessages = ref<string[]>([]);

    /**
     * Function to add log messages
     * @param {string} message - The log message
     * @param {ElectronLogLevel} [logLevel=ElectronLogLevel.INFO] - The log level
     */
    const addLog = (
        message: string,
        logLevel = ElectronLogLevel.INFO,
        fileName = import.meta.env.VITE_LOG_FILE_NAME
    ) => {
        logger.debug(message);
        logMessages.value.push(message);
        electronLogger.saveLog(message, logLevel, fileName);
    };

    /**
     * Function to add warning log messages
     * @param {string} message - The log message
     */
    const addWarnLog = (message: string) => {
        addLog(message, ElectronLogLevel.WARN);
    };

    /**
     * Function to add error log messages
     * @param {string} message - The log message
     */
    const addErrorLog = (message: string) => {
        addLog(message, ElectronLogLevel.ERROR);
    };

    /**
     * Function to add verbose log messages
     * @param {string} message - The log message
     */
    const addVerboseLog = (message: string) => {
        addLog(message, ElectronLogLevel.VERBOSE);
    };

    /**
     * Function to add debug log messages
     * @param {string} message - The log message
     */
    const addDebugLog = (message: string) => {
        addLog(message, ElectronLogLevel.DEBUG);
    };

    /**
     * Function to add silly log messages
     * @param {string} message - The log message
     */
    const addSillyLog = (message: string) => {
        addLog(message, ElectronLogLevel.SILLY);
    };

    return {
        log: logMessages,
        addLog,
        addErrorLog,
        addWarnLog,
        addVerboseLog,
        addDebugLog,
        addSillyLog,
    };
}
