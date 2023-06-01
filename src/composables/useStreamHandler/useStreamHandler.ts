import { ref } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

const currentSelectedSource = ref<MediaStream | undefined>();
const desktopCaptureSources = ref<object[]>([]);
const onlyScreenSources = ref<object[]>([]);
const onlyApplicationSources = ref<object[]>([]);
const mediaStreamsMap = ref<Record<string, MediaStream>>({});
const isLoadingScreensAndApplications = ref(false);

export default function useStreamHandler() {
    /**
     * Fetches all available desktop capture sources
     */
    const fetchAllDesktopCapturableSources = async (): Promise<void> => {
        isLoadingScreensAndApplications.value = true;

        try {
            // Get the available video sources
            desktopCaptureSources.value = await (
                window as any
            ).electronAPI.getMedia();

            // Populate the reactive arrays
            onlyScreenSources.value = desktopCaptureSources.value.filter(
                (source: any) =>
                    source.id.substring(0, source.id.indexOf(':')) === 'screen'
            );

            // Populate the reactive arrays
            onlyApplicationSources.value = desktopCaptureSources.value.filter(
                (source: any) =>
                    source.id.substring(0, source.id.indexOf(':')) === 'window'
            );

            // get the media streams
            Array.from(desktopCaptureSources.value).forEach(function (element) {
                getMediaStreams(element);
            });
        } catch (error) {
            useNotificationSystem().createErrorNotification({
                title: 'Error fetching screens and applications sources',
                message: 'Please restart the application and try again.',
            });
        }

        isLoadingScreensAndApplications.value = false;
    };

    /**
     * Sets the preview video stream to the given source
     * @param source
     */
    const setPreviewVideoStream = (source: MediaStream): void => {
        if (source === currentSelectedSource.value) {
            return;
        }

        currentSelectedSource.value = source;
    };

    /**
     * This function sets the main monitor screen of the user as the default video source
     */
    const setDefaultPreviewVideoStream = async (): Promise<void> => {
        try {
            await fetchAllDesktopCapturableSources();

            const mediaStream = await getMediaStreamFromSource(
                desktopCaptureSources.value[0]
            );

            setPreviewVideoStream(mediaStream);
        } catch (error) {
            useNotificationSystem().createErrorNotification({
                title: 'Error setting default preview video stream',
                message: 'Please restart the application and try again.',
            });
        }
    };

    /**
     * Sets the media streams to the given source and adds it to the mediastreams map
     * @param source
     */
    const getMediaStreams = async (source: any) => {
        const stream = await getMediaStreamFromSource(source);

        stream.addEventListener('inactive', () => {
            // Check if the stream is the currently previewed stream
            if (
                currentSelectedSource.value &&
                stream.id === currentSelectedSource.value.id
            ) {
                setDefaultPreviewVideoStream();
            }
            fetchAllDesktopCapturableSources();
        });

        mediaStreamsMap.value[source.id] = stream;
    };

    /**
     * Returns a media stream from the given source
     * @param source
     * @returns media stream
     */
    const getMediaStreamFromSource = async (
        source: any
    ): Promise<MediaStream> => {
        // MediaStream Constraints
        const constraints: object = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                },
            },
        };

        return await navigator.mediaDevices.getUserMedia(constraints);
    };

    return {
        currentSelectedSource,
        desktopCaptureSources,
        mediaStreamsMap,
        isLoadingScreensAndApplications,
        onlyScreenSources,
        onlyApplicationSources,
        fetchAllDesktopCapturableSources,
        setPreviewVideoStream,
        setDefaultPreviewVideoStream,
        getMediaStreamFromSource,
        getMediaStreams,
    };
}
