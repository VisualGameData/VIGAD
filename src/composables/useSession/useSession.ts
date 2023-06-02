import { ref, Ref } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';

const sessionToken = ref('');
// Reactive variable to track session status
const isSessionActive: Ref<boolean> = ref(false);

export default function useSession() {
    const { generateValidToken } = useTokenGenerator();

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
            const decodedToken = decodeURIComponent(sessionToken.value);
            const encodedToken = encodeURIComponent(sessionToken.value);

            if (decodedToken === sessionToken.value) {
                // sessionToken is not URL encoded, so encode it
                sessionToken.value = encodedToken;
            }
        } catch (error) {
            // URIError occurred, indicating that sessionToken is already URL encoded
            console.log('Session token is already URL encoded');
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
