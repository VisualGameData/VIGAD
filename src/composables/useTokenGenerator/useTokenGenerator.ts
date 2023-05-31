import { ref } from 'vue';

/**
 * Token generator composable
 */
export default function useTokenGenerator() {
    /**
     * Character set for the access token
     */
    const characterSet =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=?';

    /**
     * Minimum token length
     */
    const minTokenLenght = ref(8);

    /**
     * Default Rules for the access token
     */
    const defaultRules = {
        required: (value: string) =>
            !!value || 'An access token is required to start a session',
        min: (v: string) =>
            v.length >= minTokenLenght.value ||
            `Min ${minTokenLenght.value} characters`,
        uppercase: (v: string) =>
            /[A-Z]/.test(v) || 'Must include at least one uppercase letter',
        lowercase: (v: string) =>
            /[a-z]/.test(v) || 'Must include at least one lowercase letter',
        special: (v: string) =>
            /[\W_]/.test(v) || 'Must include at least one special character',
        number: (v: string) =>
            /[0-9]+/.test(v) || 'Must include at least one number',
    };

    /**
     * Generate a random token using crypto module in Node.js or browser depending on the environment (Node.js or browser) - browser for application and Node.js for tests and GitHub Actions
     */
    const generateToken = (
        lenght = 32,
        alphabet: string = characterSet
    ): string => {
        let generatedToken = '';

        // Checks if the environment is Node.js
        if (typeof process !== 'undefined' && process?.versions?.node) {
            // generate random bytes using crypto module in Node.js
            const { randomBytes } = require('crypto');
            const sourceBytes = randomBytes(lenght);
            generatedToken = Array.from(sourceBytes)
                .map((x: any) => alphabet[x % alphabet.length])
                .join('');
        } else {
            // generate random bytes using crypto module in browser
            const sourceBytes = new Uint8Array(lenght);
            window.crypto.getRandomValues(sourceBytes);
            generatedToken = Array.from(sourceBytes)
                .map((x) => alphabet[x % alphabet.length])
                .join('');
        }
        return generatedToken;
    };

    /**
     * Generate a valid token using the rules defined in the rules object
     * @returns a valid token
     */
    const generateValidToken = (): string => {
        const token = generateToken();
        if (
            defaultRules.lowercase(token) === true &&
            defaultRules.uppercase(token) === true &&
            defaultRules.special(token) === true &&
            defaultRules.number(token) === true &&
            defaultRules.min(token) === true
        ) {
            return token;
        }
        return generateValidToken();
    };

    return {
        characterSet,
        minTokenLenght,
        defaultRules,
        generateToken,
        generateValidToken,
    };
}
