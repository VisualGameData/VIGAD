import { ref, Ref } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

// Reactive variable to track session status
const isSessionActive: Ref<boolean> = ref(false);

export default function useSession() {
    /**
     * Starts the session
     */
    const startSession = (): void => {
        isSessionActive.value = true;
        useNotificationSystem().createNotification({
            title: 'Session started',
        });
    };

    /**
     * Stops the session
     */
    const stopSession = (): void => {
        isSessionActive.value = false;
        useNotificationSystem().createNotification({
            title: 'Session stopped',
            type: 'info',
        });
    };

    return {
        isSessionActive,
        startSession,
        stopSession,
    };
}
