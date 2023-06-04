import { ref } from 'vue';

/**
 * Token generator composable
 */
export default function useTokenGenerator() {
    /**
     * Parts of the character set
     */
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialCharacters = '!@#$%^&*()_+';
    const numbers = '0123456789';

    /**
     * Character set for the access token
     */
    const characterSet =
        lowercaseLetters + uppercaseLetters + specialCharacters + numbers;

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

            // eslint-disable-next-line @typescript-eslint/no-var-requires
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
     * @param {number} length - The length of the token (default: 32)
     * @param {string} alphabet - The set of characters used to generate the token (default: characterSet)
     * @param {boolean} isLowerCase - Indicates whether to include lowercase letters in the token (default: true)
     * @param {boolean} isUpperCase - Indicates whether to include uppercase letters in the token (default: true)
     * @param {boolean} isSpecial - Indicates whether to include special characters in the token (default: true)
     * @param {boolean} isNumber - Indicates whether to include numbers in the token (default: true)
     * @param {boolean} isMin - Indicates whether the token must satisfy a minimum requirement of having at least one character from each selected category (default: true)
     * @returns {string} - A valid token
     */
    const generateValidToken = (
        length = 32,
        alphabet = characterSet,
        isLowerCase = true,
        isUpperCase = true,
        isSpecial = true,
        isNumber = true,
        isMin = true
    ): string => {
        const token = generateToken(length, alphabet);

        const hasLowerCase = defaultRules.lowercase(token);
        const hasUpperCase = defaultRules.uppercase(token);
        const hasSpecial = defaultRules.special(token);
        const hasNumber = defaultRules.number(token);
        const meetsMinRequirement = defaultRules.min(token);

        const isValid =
            (!isLowerCase || hasLowerCase === isLowerCase) &&
            (!isUpperCase || hasUpperCase === isUpperCase) &&
            (!isSpecial || hasSpecial === isSpecial) &&
            (!isNumber || hasNumber === isNumber) &&
            (!isMin || meetsMinRequirement === isMin);

        if (isValid) {
            return token;
        }

        return generateValidToken(
            length,
            alphabet,
            isLowerCase,
            isUpperCase,
            isSpecial,
            isNumber,
            isMin
        );
    };

    return {
        lowercaseLetters,
        uppercaseLetters,
        specialCharacters,
        numbers,
        characterSet,
        minTokenLenght,
        defaultRules,
        generateToken,
        generateValidToken,
    };
}
