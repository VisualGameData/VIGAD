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
            /[0-9]*/.test(v) || 'Must include at least one number',
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
        return generatedToken;
    };

    /**
     * Generate multiple tokens using the generateToken function, but they are not guaranteed to be valid tokens (they may not meet the rules)
     * @param count
     * @returns
     */
    const generateMultipleTokens = (count: number = 16): string[] => {
        const tokens: string[] = [];
        for (let i = 0; i < count; i++) {
            const token = generateToken();
            tokens.push(token);
        }
        return tokens;
    };

    /**
     * Generate a valid token using the rules defined in the rules object
     * @returns a valid token
     */
    const generateValidToken = (): string => {
        const tokens = generateMultipleTokens();
        for (const token of tokens) {
            if (
                rules.lowercase(token) === true &&
                rules.uppercase(token) === true &&
                rules.special(token) === true &&
                rules.number(token) === true &&
                rules.min(token) === true
            ) {
                return token;
            }
        }
        return generateValidToken();
    };

    return {
        characterSet,
        minTokenLenght,
        rules,
        generateToken,
        generateMultipleTokens,
        generateValidToken,
    };
}
