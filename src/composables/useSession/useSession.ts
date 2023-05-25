import { ref } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

export const isSessionActive = ref(false);

export const useSession = () => {

    const startSession = () => {
        isSessionActive.value = true;
        useNotificationSystem().createNotification({
            title: 'Session started',
        });
    };

    const stopSession = () => {
        isSessionActive.value = false;
        useNotificationSystem().createNotification({
            title: 'Session stopped',
            type: 'info',
        });
    };

    return {
        isSessionActive,
        startSession,
        stopSession
    };
};