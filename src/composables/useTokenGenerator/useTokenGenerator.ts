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
     * Rules for the access token
     */
    const rules = {
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
            /\d/.test(v) || 'Must include at least one number',
    };

    /**
     * Generate a random token using crypto module in Node.js or browser depending on the environment (Node.js or browser) - browser for application and Node.js for tests and GitHub Actions
     */
    const generateToken = (
        lenght: number = 32,
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

        if (
            rules.lowercase(generatedToken) &&
            rules.uppercase(generatedToken) &&
            rules.special(generatedToken) &&
            rules.number(generatedToken) &&
            rules.min(generatedToken)
        ) {
            return generatedToken;
        } else {
            return generateToken();
        }
    };

    return {
        characterSet,
        minTokenLenght,
        rules,
        generateToken,
    };
}
