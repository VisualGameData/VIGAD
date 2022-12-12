import { ref } from 'vue';

/**
 * Reactive boolean that can be used to check the capture status.
 */
export const isRunning = ref(false);
export const startLogging = ref(false);
export const stopLogging = ref(false);
export const captureAreaLog = ref();

/**
 * Function that can be used to start and stop the capturing.
 */
export const useLogger = () => {
    const start = () => {
        isRunning.value = true;
    };

    return {
        isRunning,
        start,
        stop,
    };
};
