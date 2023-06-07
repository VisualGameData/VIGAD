import { onMounted, onUnmounted, ref } from 'vue';
import { Logger } from 'tslog';
import { ElectronLogLevel } from './electron-log-level';

/**
 * Create a logger instance
 */
const logger = new Logger();

/**
 * Referene to the electron logger in the main process
 */
const electronLogger = (window as any).electronAPI;

/**
 * Logger composable
 */
export default function useLogger() {
    const logMessages = ref<string[]>([]);

    // Function to add log messages
    const addLog = (message: string) => {
        logger.debug(message);
        logMessages.value.push(message);
        electronLogger.saveLog(message, ElectronLogLevel.debug);
    };

    // Lifecycle hooks
    onMounted(() => {
        logger.info('Logger initialized');
    });

    onUnmounted(() => {
        logger.info('Logger terminated');
    });

    return { log: logMessages, addLog };
}
