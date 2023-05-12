import { ref } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

/**
 * Clipboard composable
 */
export default function useClipboard() {
    /**
     * Text from the clipboard
     */
    const clipboardText = ref('');

    /**
     * Check if the clipboard is supported by the browser
     */
    const supported = 'clipboard' in navigator;

    /**
     * Save the given text to the clipboard
     * @param text
     * @returns
     */
    const writeClipboardText = async (text: string): Promise<boolean> => {
        if (!supported || !text) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            clipboardText.value = text;
            return true;
        } catch (error) {
            return false;
        }
    };

    /**
     * Read the text from the clipboard
     */
    const readClipboardText = async () => {
        try {
            const text = await navigator.clipboard.readText();
            clipboardText.value = text;
        } catch (error) {
            console.error('Failed to read from clipboard: ', error);
        }
    };

    return {
        clipboardText,
        supported,
        writeClipboardText,
        readClipboardText,
    };
}
