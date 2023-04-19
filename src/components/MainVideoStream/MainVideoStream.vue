<template>
    <div class="video-stream">
        <v-responsive id="stream" ref="stream" class="capture-area-selection">
            <video preload="none" id="mainVideo" class="video" autoplay></video>
            <VueDragResize
                v-if="isRerendering"
                v-for="captureArea in captureAreas"
                :key="captureArea.getId()"
                :stickSize="7"
                :minw="10"
                :minh="10"
                contentClass="draggable-capture-area"
                :w="captureArea.getWidth()"
                :h="captureArea.getHeight()"
                :x="captureArea.getLeft()"
                :y="captureArea.getTop()"
                :parentW="wParent"
                :parentH="hParent"
                :parentScaleX="1"
                :parentScaleY="1"
                :isActive="false"
                :snapToGrid="false"
                :aspectRatio="false"
                :preventActiveBehavior="false"
                :parentLimitation="true"
                @resizing="changeSize($event, captureArea)"
                @dragging="changePosition($event, captureArea)"
                ref="drag"
                class="center-text"
            >
                <v-tooltip activator="parent" location="top"
                    >Capture area: {{ captureArea.getId() }}</v-tooltip
                >
            </VueDragResize>
        </v-responsive>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { Vigad } from '@/proc/Vigad';
// @ts-ignore
import VueDragResize from 'vue3-drag-resize';
import { isRerendering } from '@/composables/useForceRerender';
import { Rectangle } from '../Rectangle';

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

/**
 * Get singelton instance reference to streamHandler
 */
const streamHandler = vigad.value.getStreamHandlerInstance();

/**
 * Get reference to all the capture areas that are currently active
 */
const captureAreas = vigad.value.getAllCaptureAreas();

/**
 * Stream preview properties for the main video stream
 */
const stream = ref(null);
const { width: wParent, height: hParent } = useElementSize(stream);

watch(wParent, (newValue) => {
    vigad.value.setPreviewWidth(newValue);
});

watch(hParent, (newValue) => {
    vigad.value.setPreviewHeight(newValue);
});

/**
 * fetches everything and sets the main video stream to the main screen
 */
async function setDefaultVideoStream() {
    // set the default video stream to the main screen
    await streamHandler.setDefaultVideoStream();
}

/**
 * fetches everything and sets the main video stream to the main screen
 */
function changePosition(newRect: Rectangle, item: any) {
    item.width = newRect.width;
    item.height = newRect.height;
    item.top = newRect.top;
    item.left = newRect.left;
}

/**
 * fetches everything and sets the main video stream to the main screen
 */
function changeSize(newRect: Rectangle, item: any) {
    item.width = newRect.width;
    item.height = newRect.height;
    item.top = newRect.top;
    item.left = newRect.left;
}

/**
 * On Mount of this component set the default video stream
 */
onMounted(() => {
    setDefaultVideoStream();
});
</script>

<style lang="scss" scoped>
.video-stream {
    width: inherit;
    height: inherit;
    align-self: center;
    .capture-area-selection {
        margin: 0 auto;
        width: fit-content;
        .video {
            width: 100%;
            max-height: calc(100vh - 56px - 16px - 16px);
        }
    }
}
.draggable-capture-area {
    text-align: center;
    background-color: rgba($color: #03dac6, $alpha: 0.15);
    border: 1.5px solid rgba($color: #ffffff, $alpha: 0.5);
}
</style>
