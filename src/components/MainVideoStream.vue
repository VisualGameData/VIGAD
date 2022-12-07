<template>
    <div class="video-stream">
        <v-responsive class="capture-area-selection">
            <video ref="stream" id="mainVideo" class="video" autoplay></video>
            <VueDragResize
                v-for="item in captureAreaSelections"
                :w="item.width"
                :h="item.height"
                :x="item.top"
                :y="item.top"
                :parentW="wParent"
                :parentH="hParent"
                :parentScaleX="1"
                :parentScaleY="1"
                :isActive="false"
                :snapToGrid="false"
                :aspectRatio="false"
                :preventActiveBehavior="false"
                :parentLimitation="true"
                @resizing="changeSize($event, item)"
                @dragging="changePosition($event, item)"
                class="background"
            >
                <p>Postioning {{ item.top }} x {{ item.left }}</p>
                <p>
                    Capture Area Properties {{ item.width }} x
                    {{ item.height }}
                </p>
            </VueDragResize>
        </v-responsive>
    </div>

    <!-- <v-text-field
        v-model="captureAreaSelections[0].top"
        label="Top"
        variant="outlined"
    ></v-text-field>
    <v-text-field
        v-model="captureAreaSelections[0].left"
        label="Left"
        variant="outlined"
    ></v-text-field>

    <v-text-field
    v-model="captureAreaSelections[0].width"
    label="Width of Capture Area"
    variant="outlined"
    ></v-text-field>
    <v-text-field
    v-model="captureAreaSelections[0].height"
    label="Height of Capture Area"
    variant="outlined"
    ></v-text-field> -->
    <!-- TODO: currently buggy -->

    <!-- <v-btn @click="createNewCaptureArea">Create Dragable</v-btn> -->
    {{ wParent }}
    {{ hParent }}
</template>

<!-- https://www.youtube.com/watch?v=b13NSWyQ0tw -->

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { Vigad } from '@/proc/Vigad';
// TODO: maybe abstract it late into its own component
import CaptureAreaSelectionVue from './capture-area/CaptureAreaSelection.vue';
// TODO: maybe fix this import type declaration problem
// @ts-ignore
import VueDragResize from 'vue3-drag-resize';

// Get singelton instance reference to vigad
const vigad = Vigad.getInstance();

// Get singelton instance reference to streamHandler
const streamHandler = vigad.getStreamHandlerInstance();

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

// Parent properties
const stream = ref(null);
const { width: wParent, height: hParent } = useElementSize(stream);

// Capture area properties

interface Rectangle {
    width: number;
    height: number;
    top: number;
    left: number;
}

const captureAreaSelections = ref<Rectangle[]>([
    {
        width: 100,
        height: 100,
        top: 100,
        left: 100,
    },
]);

function createNewCaptureArea() {
    const newCaptureArea = ref<Rectangle>({
        width: 100,
        height: 100,
        top: 0,
        left: 0,
    });

    captureAreaSelections.value.push(newCaptureArea.value);
}

function changePosition(newRect: Rectangle, item: Rectangle) {
    // TODO: later set the new values via the class setter and getter
    item.width = newRect.width;
    item.height = newRect.height;
    item.top = newRect.top;
    item.left = newRect.left;
    // right.value = left.value + width.value - wParent.value;
    // bottom.value = top.value + height.value - hParent.value;
}
function changeSize(newRect: Rectangle, item: Rectangle) {
    // TODO: later set the new values via the class setter and getter
    item.width = newRect.width;
    item.height = newRect.height;
    item.top = newRect.top;
    item.left = newRect.left;
}

// currently not used
const newWidth = ref<number>(0);
const newHeight = ref<number>(0);
const newTop = ref<number>(0);
const newLeft = ref<number>(0);

watch(
    [wParent, hParent],
    (
        [newParentWidth, newParentHeight],
        [prevParentWidth, prevParentHeight]
    ) => {
        // when this fires i can change adjust the size of the capture area
        console.log('Parent width changed', newParentWidth);
        console.log('Parent width changed', prevParentWidth);
        console.log('Parent height changed', newParentHeight);
        console.log('Parent height changed', prevParentHeight);

        console.log('Parent difference', newParentWidth - prevParentWidth);
        console.log('Parent difference', newParentHeight - prevParentHeight);
    }
);
</script>

<style lang="scss" scoped>
.video-stream {
    position: relative;
    overflow: hidden;
    background-color: red;
    min-height: inherit;
    max-height: inherit;
    display: grid;
    justify-content: center;
    align-content: center;
    .capture-area-selection {
        width: 100%;
        margin: auto;
        max-height: inherit;
        background-color: blue;
        .video {
            width: 100%;
            height: 100%;
        }
    }
}
.background {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
