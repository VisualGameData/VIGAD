import { ref } from 'vue';

/**
 * Reactive boolean that can be used to check the capture status.
 */
export const isRunning = ref(false);

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
