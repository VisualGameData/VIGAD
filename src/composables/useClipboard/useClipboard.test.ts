import { describe, it, expect } from 'vitest';
import useClipboard from '@/composables/useClipboard/useClipboard';

describe('useClipboard Composable', () => {
    it('clipboardText is empty on initialization', () => {
        const { clipboardText } = useClipboard();

        expect(clipboardText.value).toBe('');
    });

    it('returns false if text is empty', async () => {
        const { writeClipboardText } = useClipboard();

        const result = await writeClipboardText('');

        expect(result).toBe(false);
    });

    it('writes text to clipboard', async () => {
        const { writeClipboardText, clipboardText } = useClipboard();

        const text = 'Hello, world!';
        const result = await writeClipboardText(text);

        expect(result).toBe(true);
        expect(clipboardText.value).toBe(text);
    });

    it('reads text from clipboard', async () => {
        const { writeClipboardText, readClipboardText } = useClipboard();

        const text = 'Hello, world!';
        await writeClipboardText(text);

        const result = await readClipboardText();
        expect(result).toBe(text);
    });
});
