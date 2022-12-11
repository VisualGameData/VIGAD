import { ref } from 'vue';

/**
 * Reactive boolean that can be used to check the capture status.
 */
export const isRunning = ref(false);

/**
 * Function that can be used to start and stop the capturing.
 */
export const useRunning = () => {
    const start = () => {
        isRunning.value = true;
    };

    const stop = () => {
        isRunning.value = false;
    };

    return {
        isRunning,
        start,
        stop,
    };
};
