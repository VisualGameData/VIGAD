import { ref } from 'vue';

/**
 
Upload data composable*/
export default function useUploadData() {
    const streamData = ref(true);
    const streamRegexAndCaptureAreaSettings = ref(false);

    const getStreamData = () => {
        return streamData.value;
    };

    const getStreamRegexAndCaptureAreaSettings = () => {
        return streamRegexAndCaptureAreaSettings.value;
    };

    const setStreamData = (value: boolean) => {
        streamData.value = value;
    };

    const setStreamRegexAndCaptureAreaSettings = (value: boolean) => {
        streamRegexAndCaptureAreaSettings.value = value;
    };

    return {
        streamData,
        streamRegexAndCaptureAreaSettings,
        getStreamData,
        getStreamRegexAndCaptureAreaSettings,
        setStreamData,
        setStreamRegexAndCaptureAreaSettings
    };
};