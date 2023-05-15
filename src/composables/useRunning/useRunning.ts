import { ref } from 'vue';
import { Vigad } from '../../proc/Vigad';

/**
 * Reactive boolean that can be used to check the capture status.
 */
export const isRunning = ref(false);

/**
 * Function that can be used to start and stop the capturing.
 */
export const useRunning = () => {
    const vigad = Vigad.getInstance();

    const start = () => {
        isRunning.value = true;
        vigad.startTesseract();
    };

    const stop = () => {
        isRunning.value = false;
        vigad.stopTesseract();
    };

    return {
        isRunning,
        start,
        stop,
    };
};
