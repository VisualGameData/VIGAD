<!-- TODO: rename component with a more appropirate name -->
<template>
    <div class="video-stream">
        <v-responsive aspect-ratio="16 / 9" class="border">
            <video
                id="mainVideo"
                autoplay
                class="video"
                ref="mainVideo"
            ></video>
        </v-responsive>
        <div>
            x: {{ x }} y: {{ y }} Is Outside: {{ isOutside }}

            Height: {{ height }} Width: {{ width }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMouseInElement, useElementSize } from '@vueuse/core';
import { DesktopVideoStream } from '@/proc/DesktopVideoStream';

// Get singelton instance of DesktopVideoStream
const desktopVideoStream = DesktopVideoStream.getInstance();

// Mouse position relative to the element and is in and out
const mainVideo = ref<HTMLVideoElement | null>(null);

// Mouse coordinates relative to the element and if cursor is inside of the element
const { x, y, isOutside } = useMouseInElement(mainVideo);

// Element size
const { width, height } = useElementSize(mainVideo);

onMounted(() => {
    // fetch all sources at the time of mounting/application
    fetchAllStreamsAndSetMainVideo();
});

/**
 * fetches everything and sets the main video stream to the main screen
 */
async function fetchAllStreamsAndSetMainVideo() {
    desktopVideoStream.setIsLoadingScreensAndApplications(true);

    // Fetch the screens and windows
    await desktopVideoStream.fetchAllMediaStreams();

    // set the main video stream to the main screen
    await selectSource(desktopVideoStream.getMainScreenSource());

    desktopVideoStream.setIsLoadingScreensAndApplications(false);
}

/**
 * Load a specific stream source as main video
 *
 * @param {any} source
 */
async function selectSource(source: any) {
    // Set the selected source
    desktopVideoStream.setCurrentSelectedSource(source);

    const videoElement: HTMLVideoElement | null =
        document.querySelector('#mainVideo');

    // MediaStream Constraints
    const constraints: any = {
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
            },
        },
    };

    // Preview the source in a video element
    const currentStream = await navigator.mediaDevices.getUserMedia(
        constraints
    );
    videoElement!.srcObject = currentStream;
}
</script>

<style lang="scss" scoped>
.video-stream {
    width: 100%;
    object-fit: cover;
}
.video {
    width: 100%;
}
</style>
