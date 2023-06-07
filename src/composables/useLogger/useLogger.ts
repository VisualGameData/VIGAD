import { onMounted, onUnmounted, ref } from 'vue';
import { Logger } from 'tslog';
import log from 'electron-log';

/**
 * Create a logger instance
 */
const logger = new Logger();

/**
 * Logger composable
 */
export default function useLogger() {
    const logMessages = ref<string[]>([]);

    // Function to add log messages
    function addLog(message: string) {
        logger.debug(message);
        logMessages.value.push(message);
        log.info(message); // Save log message using electron-log
    }

    // Lifecycle hooks
    onMounted(() => {
        logger.info('Logger initialized');
    });

    onUnmounted(() => {
        logger.info('Logger terminated');
    });

    return { log: logMessages, addLog };
}
