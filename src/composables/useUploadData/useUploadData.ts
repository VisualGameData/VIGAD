import { ref } from 'vue';

const streamData = ref(false);
const streamRegexAndCaptureAreaSettings = ref(false);

/**
 * Uploadable data composable
 */
export default function useUploadData() {
    return {
        streamData,
        streamRegexAndCaptureAreaSettings,
    };
}
