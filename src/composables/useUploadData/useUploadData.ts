import { ref } from 'vue';

const streamData = ref(true);
const streamRegexAndCaptureAreaSettings = ref(false);

/**
 * Uploadable data composable
 */
export default function useUploadData() {
    /**
     * Get the current value of streamData.
     * @returns {boolean} The current value of streamData.
     */
    const getStreamData = (): boolean => {
        return streamData.value;
    };

    /**
     * Get the current value of streamRegexAndCaptureAreaSettings.
     * @returns {boolean} The current value of streamRegexAndCaptureAreaSettings.
     */
    const getStreamRegexAndCaptureAreaSettings = (): boolean => {
        return streamRegexAndCaptureAreaSettings.value;
    };

    /**
     * Set the value of streamData.
     * @param {boolean} value
     */
    const setStreamData = (value: boolean): void => {
        streamData.value = value;
    };

    /**
     * Set the value of streamRegexAndCaptureAreaSettings.
     * @param {boolean} value
     */
    const setStreamRegexAndCaptureAreaSettings = (value: boolean): void => {
        streamRegexAndCaptureAreaSettings.value = value;
    };

    return {
        streamData,
        streamRegexAndCaptureAreaSettings,
        getStreamData,
        getStreamRegexAndCaptureAreaSettings,
        setStreamData,
        setStreamRegexAndCaptureAreaSettings,
    };
}
