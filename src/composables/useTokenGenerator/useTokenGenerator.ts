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
        len: number = 12,
        alphabet: string = characterSet
    ): string => {
        const genToken = require('@josephg/gentoken');
        const t = genToken(32, alphabet);
        console.log(t);
        return t;
        // const sourceBytes = randomBytes(len);
        // const generatedToken = Array.from(sourceBytes)
        //     .map((xs: number) => alphabet[xs % alphabet.length])
        //     .join('');

        // const buffer = new Uint8Array(32);
        // crypto.getRandomValues(buffer);
        // const generatedToken = Array.from(buffer)
        //     .map((x) => characterSet[x % characterSet.length])
        //     .join('');
        // if (
        //     rules.lowercase(generatedToken) &&
        //     rules.uppercase(generatedToken) &&
        //     rules.special(generatedToken) &&
        //     rules.number(generatedToken) &&
        //     rules.min(generatedToken)
        // ) {
        //     return generatedToken;
        // } else {
        //     return generateToken();
        // }
    };

    return {
        minTokenLenght,
        rules,
        generateToken,
    };
}
