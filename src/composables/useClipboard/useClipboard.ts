import { ref } from 'vue';
import clipboardy from 'clipboardy';

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
    const supported = navigator && navigator.clipboard;

    /**
     * Save the given text to the clipboard
     * @param text
     * @returns
     */
    const writeClipboardText = async (text: string): Promise<boolean> => {
        if (!text) {
            return false;
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                clipboardText.value = text;
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        } else if (typeof clipboardy !== 'undefined') {
            try {
                clipboardy.writeSync(text);
                clipboardText.value = text;
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        } else {
            console.error('Clipboard not supported');
            return false;
        }
    };

    /**
     * Read the text from the clipboard
     */
    const readClipboardText = async (): Promise<string> => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                const text = await navigator.clipboard.readText();
                clipboardText.value = text;
                return text;
            } catch (error) {
                console.error(error);
                return '';
            }
        } else if (typeof clipboardy !== 'undefined') {
            try {
                const text = clipboardy.readSync();
                clipboardText.value = text;
                return text;
            } catch (error) {
                console.error(error);
                return '';
            }
        } else {
            console.error('Clipboard not supported');
            return '';
        }
    };

    return {
        clipboardText,
        supported,
        writeClipboardText,
        readClipboardText,
    };
}
