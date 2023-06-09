import { ref, Ref, watch } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';

// Reactive variable for the session token
const sessionToken = ref('');

// Reactive variable to track session status
const isSessionActive: Ref<boolean> = ref(false);

export default function useSession() {
    /**
     * Import token generator rules and functions from useTokenGenerator composable
     */
    const {
        requiredRule,
        minCharactersRule,
        maxCharactersRule,
        lowercaseLettersRule,
        uppercaseLettersRule,
        specialCharactersRule,
        numbersRule,
        generateValidToken,
    } = useTokenGenerator();

    /**
     * Extend default rules with own rules
     */
    const sessionTokenRules = {
        required: requiredRule,
        minCharacters: minCharactersRule,
        maxCharacters: maxCharactersRule,
        lowercaseLetters: lowercaseLettersRule,
        uppercaseLetters: uppercaseLettersRule,
        specialCharacters: specialCharactersRule,
        numbers: numbersRule,
        uriValidation: (v: string) =>
            encodeSessionToken(v) ||
            'Token cannot be transformed into a valid URI',
    };

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
        sessionToken.value = generateValidToken(
            undefined,
            undefined,
            sessionTokenRules
        );
    };

    /**
     * Encodes the session token by URI encoding it.
     * @param {string} input - The session token to be encoded. Defaults to the value of `sessionToken.value`.
     * @returns {boolean} - Returns `true` if the token is already encoded or if it was successfully encoded. Returns `false` if the token could not be encoded.
     */
    const encodeSessionToken = (input = sessionToken.value): boolean => {
        try {
            // Return true if the token is already encoded or if it was successfully encoded
            const decodedToken = decodeURIComponent(decodeURI(input));
            const isAlreadyEncoded = decodedToken !== input;
            if (!isAlreadyEncoded) {
                sessionToken.value = encodeURIComponent(decodedToken);
            }
            return true;
        } catch (error) {
            // Return false if the token could not be encoded
            // TODO: maybe add logger
            return false;
        }
    };

    return {
        sessionToken,
        isSessionActive,
        sessionTokenRules,
        startSession,
        stopSession,
        generateSessionToken,
        encodeSessionToken,
    };
}
