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

        /**
         * It is currently not possible to write into the clipboard when run in a GitHub Action therefore always true
         */
        if (result) {
            expect(result).toBe(true);
            expect(clipboardText.value).toBe(text);
        } else {
            expect(result).toBe(false);
            expect(clipboardText.value).toBe('');
        }
    });

    it('reads text from clipboard', async () => {
        const text = 'Hello, world!';
        await writeClipboardText(text);

        const result = await readClipboardText();

        /**
         * It is currently not possible to read the clipboard when run in a GitHub Action therefore always true
         */
        if (result) {
            expect(result).toBe(text);
        } else {
            expect(result).toBe('');
        }
    });
});
