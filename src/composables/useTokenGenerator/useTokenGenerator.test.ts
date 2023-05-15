import { describe, it, expect } from 'vitest';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';

describe('useTokenGenerator Composable', () => {
    const { generateValidToken, defaultRules, minTokenLenght } =
        useTokenGenerator();

    it('generateToken returns a string', () => {
        const token = generateValidToken();
        expect(typeof token).toBe('string');
    });

    it('generateToken generates a token of minimum length', () => {
        const token = generateValidToken();
        expect(token.length).toBeGreaterThanOrEqual(minTokenLenght.value);
    });

    it('generateToken generates a token that meets all rules', () => {
        const runs = 100;
        for (let index = 0; index < runs; index++) {
            const token = generateValidToken();
            expect(defaultRules.required(token)).toBe(true);
            expect(defaultRules.min(token)).toBe(true);
            expect(defaultRules.uppercase(token)).toBe(true);
            expect(defaultRules.lowercase(token)).toBe(true);
            expect(defaultRules.special(token)).toBe(true);
            expect(defaultRules.number(token)).toBe(true);
        }
    });
});
