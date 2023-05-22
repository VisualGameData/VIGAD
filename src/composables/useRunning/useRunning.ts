import { ref } from 'vue';
import { Vigad } from '../../proc/Vigad';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

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
        useNotificationSystem().createNotification({
            title: 'Started Capturing',
            message: 'Capturing is now running'
        });
    };

    const stop = () => {
        isRunning.value = false;
        vigad.stopTesseract();
        useNotificationSystem().createWarningNotification({
            title: 'Stopped Capturing',
            message: 'Capturing was stopped'
        })
    };

    return {
        isRunning,
        start,
        stop,
    };
};
