<template>
    <div class="video-stream">
        <v-responsive id="stream" ref="stream" class="capture-area-selection">
            <video id="mainVideo" class="video" autoplay></video>
            <VueDragResize
                v-if="isRerendering"
                v-for="captureArea in captureAreas"
                :key="captureArea.getId()"
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
                class="background"
                ref="drag"
            >
                <p>
                    Postioning {{ captureArea.getTop() }} x
                    {{ captureArea.getLeft() }}
                </p>
                <p>
                    Capture Area Properties {{ captureArea.getWidth() }} x
                    {{ captureArea.getHeight() }}
                </p>
            </VueDragResize>
        </v-responsive>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useElementSize } from '@vueuse/core';
import { Vigad } from '@/proc/Vigad';
// @ts-ignore
import VueDragResize from 'vue3-drag-resize';
import { isRerendering } from '@/composables/useForceRerender';
import { Rectangle } from './Rectangle';

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
    position: relative;
    overflow: hidden;
    // background-color: red;
    min-height: inherit;
    max-height: inherit;
    margin: 0 auto; /*centers the video*/
    // display: flex;
    // justify-content: center;
    // align-content: center;
    .capture-area-selection {
        position: relative;
        // width: 100%;
        max-height: inherit;
        // background-color: blue;
        display: flex;
        .video {
            position: relative;
            width: 100%;
            // max-height: inherit;
            height: 100%;
        }
    }
}
.background {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
