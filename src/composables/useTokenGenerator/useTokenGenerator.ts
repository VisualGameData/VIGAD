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
     * Generate a random token
     */
    const generateToken = (
        lenght: number = 32,
        alphabet: string = characterSet
    ): string => {
        // https://github.com/josephg/gentoken/tree/master
        // const genToken = require('@josephg/gentoken');

        // const generatedToken = genToken(lenght);
        // const generatedToken = randomBytes(length)
        //     .toString('base64')
        //     .replace(/\+/g, '-')
        //     .replace(/\//g, '_')
        //     .replace(/=/g, '');
        // // remove base64 padding, replace unsafe chars
        let generatedToken = '';

        // Check if running in Node.js
        if (typeof process !== 'undefined' && process?.versions?.node) {
            console.log('Running in Node.js');
            // Check for Node.js crypto support
            try {
                const { randomBytes } = require('crypto');
                const sourceBytes = randomBytes(lenght);
                generatedToken = Array.from(sourceBytes)
                    .map((x: any) => alphabet[x % alphabet.length])
                    .join('');
            } catch (err) {
                console.log('No Node', err);
            }
        } else {
            console.log('Running in browser');
            // Test for browser crypto support
            try {
                const sourceBytes = new Uint8Array(lenght);
                window.crypto.getRandomValues(sourceBytes);
                generatedToken = Array.from(sourceBytes)
                    .map((x) => alphabet[x % alphabet.length])
                    .join('');
            } catch (err) {
                console.log('No Browser', err);
            }
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
        minTokenLenght,
        rules,
        generateToken,
    };
}
