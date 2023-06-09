import { ref } from 'vue';
import useSession from '@/composables/useSession/useSession';

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
     * Token length
     */
    const minTokenLenght = ref(8);
    const maxTokenLenght = ref(64);

    /**
     * Definable rules for an token
     */
    const requiredRule = (value: string) =>
        !!value || 'An access token is required to start a session';

    const minCharactersRule = (v: string) =>
        v.length >= minTokenLenght.value ||
        `Min ${minTokenLenght.value} characters`;

    const maxCharactersRule = (v: string) =>
        v.length <= 64 || `Max ${maxTokenLenght.value} characters`;

    const lowercaseLettersRule = (v: string) =>
        /[a-z]/.test(v) || 'Must include at least one lowercase letter';

    const uppercaseLettersRule = (v: string) =>
        /[A-Z]/.test(v) || 'Must include at least one uppercase letter';

    const specialCharactersRule = (v: string) =>
        /[\W_]/.test(v) || 'Must include at least one special character';

    const numbersRule = (v: string) =>
        /[0-9]+/.test(v) || 'Must include at least one number';

    /**
     * Default Rules for the access token
     */
    const defaultRules = {
        required: requiredRule,
        min: minCharactersRule,
        max: maxCharactersRule,
        uppercase: uppercaseLettersRule,
        lowercase: lowercaseLettersRule,
        special: specialCharactersRule,
        number: numbersRule,
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
        rules: {
            [key: string]: (value: string) => boolean | string;
        } = defaultRules
    ): string => {
        const token = generateToken(length, alphabet);

        const validationResults = Object.values(rules).map((ruleFn) => {
            return {
                ruleFn,
                validationResult: ruleFn(token),
            };
        });

        const isValid = validationResults.every(({ validationResult }) => {
            return !validationResult || validationResult === true;
        });

        if (isValid) {
            return token;
        }

        return generateValidToken(length, alphabet, rules);
    };

    return {
        // Token Lenght
        minTokenLenght,
        maxTokenLenght,
        // Rules
        requiredRule,
        minCharactersRule,
        maxCharactersRule,
        lowercaseLettersRule,
        uppercaseLettersRule,
        specialCharactersRule,
        numbersRule,
        defaultRules,
        // Functions
        generateToken,
        generateValidToken,
    };
}
