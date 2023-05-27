import { ref, onMounted } from 'vue';
import useNotificationSystem from '../useNotificationSystem/useNotificationSystem';

const currentSelectedSource = ref<MediaStream | undefined>();
const desktopCaptureSources = ref<Object[]>([]);
const onlyScreenSources = ref<Object[]>([]);
const onlyApplicationSources = ref<Object[]>([]);
const mediaStreamsMap = ref<Record<string, MediaStream>>({});
const isLoadingScreensAndApplications = ref(false);

export function useStreamHandler() {

    // Set the default video stream when mounted
    onMounted(async () => {
        await setDefaultPreviewVideoStream();
    });

    /**
     * Fetches all available desktop capture sources
     */
    async function fetchAllDesktopCapturableSources(): Promise<void> {
        isLoadingScreensAndApplications.value = true;

        try {
            // Get the available video sources
            desktopCaptureSources.value = await (window as any).electronAPI.getMedia();

            // Populate the reactive arrays
            onlyScreenSources.value = desktopCaptureSources.value.filter(
                (source: any) => source.id.substring(0, source.id.indexOf(':')) === 'screen'
            );

            // Populate the reactive arrays
            onlyApplicationSources.value = desktopCaptureSources.value.filter(
                (source: any) => source.id.substring(0, source.id.indexOf(':')) === 'window'
            );

            // get the media streams
            Array.from(desktopCaptureSources.value).forEach(function (element) {
                getMediaStreams(element);
            });

        } catch (error) {
            useNotificationSystem().createErrorNotification({
                title: 'Error fetching screens and applications sources',
                message: 'Please restart the application and try again.'
            })
        }

        isLoadingScreensAndApplications.value = false;
    }

    /**
     * Sets the preview video stream to the given source
     * @param source 
     */
    function setPreviewVideoStream(source: MediaStream): void {
        if (source === currentSelectedSource.value) {
            return;
        }

        currentSelectedSource.value = source;
    }

    /**
     * This function sets the main monitor screen of the user as the default video source
     */
    async function setDefaultPreviewVideoStream(): Promise<void> {
        try {
            await fetchAllDesktopCapturableSources();

            const mediaStream = await getMediaStreamFromSource(desktopCaptureSources.value[0]);

            await setPreviewVideoStream(mediaStream);
        } catch (error) {
            useNotificationSystem().createErrorNotification({
                title: 'Error setting default preview video stream',
                message: 'Please restart the application and try again.'
            });
        }
    }

    /**
     * Sets the media streams to the given source and adds it to the mediastreams map
     * @param source 
     */
    async function getMediaStreams(source: any) {
        const stream = await getMediaStreamFromSource(source)

        stream.addEventListener('inactive', () => {
            // Check if the stream is the currently previewed stream
            if (stream.id === currentSelectedSource.value!.id) {
                setDefaultPreviewVideoStream();
            }
            fetchAllDesktopCapturableSources();
        });

        mediaStreamsMap.value[source.id] = stream;
    }

    /**
     * Returns a media stream from the given source
     * @param source 
     * @returns media stream
     */
    async function getMediaStreamFromSource(source: any): Promise<MediaStream> {
        // MediaStream Constraints
        const constraints: any = {
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                },
            },
        };

        return await navigator.mediaDevices.getUserMedia(constraints);
    }

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
