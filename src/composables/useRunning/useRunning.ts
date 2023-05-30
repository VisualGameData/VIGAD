import { ref } from 'vue';
import { Vigad } from '../../proc/Vigad';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

/**
 * Reactive boolean that can be used to check the capture status.
 */
const isRunning = ref(false);

/**
 * Function that can be used to start and stop the capturing.
 */
export default function useRunning() {
    const vigad = Vigad.getInstance();

    /**
     * Start capturing.
     */
    const start = (): void => {
        isRunning.value = true;
        vigad.startTesseract();
        useNotificationSystem().createNotification({
            title: 'Started Capturing',
            message: 'Capturing is now running',
        });
    };

    /**
     * Stop capturing.
     */
    const stop = (): void => {
        isRunning.value = false;
        vigad.stopTesseract();
        useNotificationSystem().createWarningNotification({
            title: 'Stopped Capturing',
            message: 'Capturing was stopped',
        });
    };

    return {
        isRunning,
        start,
        stop,
    };
}
