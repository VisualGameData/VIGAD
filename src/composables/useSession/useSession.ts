import { ref, Ref, watch } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';

const sessionToken = ref('');

// Reactive variable to track session status
const isSessionActive: Ref<boolean> = ref(false);

export default function useSession() {
    const { generateValidToken } = useTokenGenerator();

    /**
     * Watch the session token and encode it if it changes to ensure it is always encoded
     */
    watch(sessionToken, () => {
        encodeSessionToken();
    });

    /**
     * Starts the session
     */
    const startSession = (): void => {
        // Encode the session token if it is not already encoded as a fallback
        encodeSessionToken();
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

    /**
     * Generates a new session token with uri encoding
     */
    const generateSessionToken = (): void => {
        sessionToken.value = generateValidToken();
        encodeSessionToken();
    };

    /**
     * Encodes the session token if it is not already encoded by default
     */
    const encodeSessionToken = (): void => {
        try {
            sessionToken.value = encodeURIComponent(
                decodeURIComponent(sessionToken.value)
            );
        } catch (error) {
            if (error instanceof URIError) {
                console.log('Session token is already URL encoded');
            } else {
                console.error('Error decoding session token:', error);
            }
        }
    };

    return {
        sessionToken,
        isSessionActive,
        startSession,
        stopSession,
        generateSessionToken,
        encodeSessionToken,
    };
}
