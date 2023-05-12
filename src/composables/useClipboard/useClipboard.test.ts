import { describe, it, expect } from 'vitest';
import useClipboard from '@/composables/useClipboard/useClipboard';

describe('useClipboard Composable', () => {
    const { clipboardText, writeClipboardText, readClipboardText } =
        useClipboard();

    it('clipboardText is empty on initialization', () => {
        expect(clipboardText.value).toBe('');
    });

    it('returns false if text is empty', async () => {
        const result = await writeClipboardText('');

        expect(result).toBe(false);
    });

    it('writes text to clipboard', async () => {
        const text = 'Hello, world!';
        const result = await writeClipboardText(text);

        expect(result).toBe(true);
        console.log(result);
        expect(clipboardText.value).toBe(text);
    });

    it('reads text from clipboard', async () => {
        const text = 'Hello, world!';
        await writeClipboardText(text);

        const result = await readClipboardText();
        console.log(result);
        expect(result).toBe(text);
    });
});
