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
import { Vigad } from '@/proc/Vigad';

// Get singelton instance reference to vigad
const vigad = Vigad.getInstance();

// Get singelton instance reference to streamHandler
const streamHandler = vigad.getStreamHandlerInstance();

// Mouse position relative to the element and is in and out
const mainVideo = ref<HTMLVideoElement | null>(null);

// Mouse coordinates relative to the element and if cursor is inside of the element
const { x, y, isOutside } = useMouseInElement(mainVideo);

// Element size
const { width, height } = useElementSize(mainVideo);

onMounted(() => {
    setDefaultVideoStream();
});

/**
 * fetches everything and sets the main video stream to the main screen
 */
async function setDefaultVideoStream() {
    // set the default video stream to the main screen
    await streamHandler.setDefaultVideoStream();
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
