import { describe, it, expect } from 'vitest';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';

describe('useTokenGenerator Composable', () => {
    const { generateToken, rules, minTokenLenght } = useTokenGenerator();

    it('generateToken returns a string', () => {
        const token = generateToken();
        expect(typeof token).toBe('string');
    });

    it('generateToken generates a token of minimum length', () => {
        const token = generateToken();
        expect(token.length).toBeGreaterThanOrEqual(minTokenLenght.value);
    });

    it('generateToken generates a token that meets all rules', () => {
        const token = generateToken();
        expect(rules.required(token)).toBe(true);
        expect(rules.min(token)).toBe(true);
        expect(rules.uppercase(token)).toBe(true);
        expect(rules.lowercase(token)).toBe(true);
        expect(rules.special(token)).toBe(true);
        expect(rules.number(token)).toBe(true);
    });
});
