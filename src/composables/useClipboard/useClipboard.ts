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
    const writeClipboardText = async (text: string) => {
        if (!supported) {
            useNotificationSystem().createErrorNotification({
                title: 'Clipboard not supported',
                message: 'Your browser does not support the clipboard API.',
            });
            return;
        }

        if (!text) {
            useNotificationSystem().createErrorNotification({
                title: 'Empty clipboard',
                message: 'Cannot copy empty text to clipboard.',
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            clipboardText.value = text;
            useNotificationSystem().createSuccessNotification({
                title: 'Copied to clipboard',
                message: 'The text has been copied to your clipboard.',
            });
        } catch (error) {
            useNotificationSystem().createErrorNotification({
                title: 'Failed to copy to clipboard',
                message: 'Failed to copy the text to your clipboard.',
            });
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
