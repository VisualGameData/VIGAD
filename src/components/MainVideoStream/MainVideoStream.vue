<template>
    <div class="video-stream">
        <v-responsive id="stream" ref="stream" class="capture-area-selection">
            <video preload="none"  class="video" autoplay ref="videoRef"></video>
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
import { ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { Vigad } from '@/proc/Vigad';
import { isRerendering } from '@/composables/useForceRerender/useForceRerender';
import { Rectangle } from './Rectangle';
import { useStreamHandler } from '@/composables/useStreamHandler/useStreamHandler';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
// @ts-ignore
import VueDragResize from 'vue3-drag-resize';

/**
 * Get reference to the video element that is used to preview the video stream of the main screen 
 */
const { currentSelectedSource } = useStreamHandler();
const videoRef = ref<any>(null);

/**
 * Set Video Sources Preview to the main screen (the one that is selected)
 */
watch(currentSelectedSource, (newSource) => {
  try {
    if (newSource && videoRef.value) {
      videoRef.value.srcObject = newSource;
    }
  } catch (error) {
    useNotificationSystem().createErrorNotification({
        title: 'An error occured while setting the preview video stream',
        message: 'Please restart the application and try again.'
    })
  }
});

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

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
