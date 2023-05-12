import { describe, it, expect } from 'vitest';
import useClipboard from '@/composables/useClipboard/useClipboard';

describe('useClipboard Composable', () => {
    it('clipboardText is empty on initialization', () => {
        const { clipboardText } = useClipboard();

        expect(clipboardText.value).toBe('');
    });
});
