<!-- TODO: rename component with a more appropirate name -->
<template>
    <div ref="stream" class="video-stream">
        <v-responsive
            aspect-ratio="16 / 9"
            class="border capture-area-selection"
        >
            <video
                id="mainVideo"
                autoplay
                class="video"
                ref="mainVideo"
            ></video>
        </v-responsive>
        <!-- <CaptureAreaSelectionVue
            v-for="item in captureAreaSelections"
            :x-parent="x"
            :y-parent="y"
            :width="width"
            :height="height"
            :bottom="bottom"
            :top="top"
            :left="left"
            :right="right"
        /> -->
        <VueDragResize
            v-for="item in captureAreaSelections"
            :isActive="false"
            :w="width"
            :h="height"
            :x="left"
            :y="top"
            :snapToGrid="false"
            :gridY="50"
            :parentScaleX="1"
            :parentScaleY="1"
            :parentW="wParent"
            :preventActiveBehavior="false"
            :parentH="hParent"
            :parentLimitation="true"
            v-on:resizing="changeSize($event)"
            v-on:dragging="changePosition($event)"
            @click="logThings"
            :aspectRatio="false"
            class="background"
        >
            <p>Postioning {{ top }} x {{ left }}</p>
            <p>Capture Area Properties {{ width }} x {{ height }}</p>
        </VueDragResize>
    </div>

    <v-text-field v-model="top" label="Top" variant="outlined"></v-text-field>
    <v-text-field v-model="left" label="Left" variant="outlined"></v-text-field>

    <v-text-field
        v-model="width"
        label="Width"
        variant="outlined"
    ></v-text-field>
    <v-text-field
        v-model="height"
        label="Height"
        variant="outlined"
    ></v-text-field>

    <v-btn @click="createNewCaptureArea">Create Dragable</v-btn>
</template>

<!-- https://www.youtube.com/watch?v=b13NSWyQ0tw -->

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { Vigad } from '@/proc/Vigad';
// TODO: maybe fix this import type declaration problem
// @ts-ignore
import VueDragResize from 'vue3-drag-resize';
import { valid } from 'semver';

// Get singelton instance reference to vigad
const vigad = Vigad.getInstance();

// Get singelton instance reference to streamHandler
const streamHandler = vigad.getStreamHandlerInstance();

const captureAreaSelections = ref([1]);

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

function createNewCaptureArea() {
    captureAreaSelections.value.push(captureAreaSelections.value.length + 1);
}

const stream = ref(null);
const { width: wParent, height: hParent } = useElementSize(stream);

// Default vlaues
const width = ref(100);
const height = ref(100);
// Center horizontal
// wParent.value / 2 - width.value / 2
const top = ref();
//Center Vertically
// hParent.value / 2 - height.value / 2
const left = ref();
// calculated by top and left
const bottom = ref(0);
const right = ref(0);

interface Rectangle {
    width: number;
    height: number;
    top: number;
    left: number;
}

function changePosition(newRect: Rectangle) {
    console.log(newRect);
    width.value = newRect.width;
    height.value = newRect.height;
    top.value = newRect.top;
    left.value = newRect.left;
    right.value = left.value + width.value - wParent.value;
    bottom.value = top.value + height.value - hParent.value;
}
function changeSize(newRect: Rectangle) {
    width.value = newRect.width;
    height.value = newRect.height;
    top.value = newRect.top;
    left.value = newRect.left;
    right.value = left.value + width.value - wParent.value;
    bottom.value = top.value + height.value - hParent.value;
}

const newWidth = ref<number>(0);
const newHeight = ref<number>(0);
const newTop = ref<number>(0);
const newLeft = ref<number>(0);

function logThings() {
    // console.log('Rectangle Postion - top and left');
    // console.log(top.value + height.value);
    // console.log('left', left.value);
    // console.log('right', right.value);
    // console.log('widt', width.value);
    // console.log('total', left.value + width.value + right.value);
    // console.log("Parent's width and height");
    // console.log(wParent.value);
    // console.log(hParent.value);
    // console.log('Ration', wParent.value / hParent.value);
    changeSize({
        width: width.value,
        height: height.value,
        top: top.value,
        left: left.value,
    });
}

watch(
    [wParent, hParent],
    (
        [newParentWidth, newParentHeight],
        [prevParentWidth, prevParentHeight]
    ) => {
        // when this fires i can change adjust the size of the capture area
        console.log('Parent width changed', newParentWidth);
        console.log('Parent height changed', newParentHeight);
    }
);
</script>

<style lang="scss" scoped>
.video-stream {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .video {
        width: 100%;
        height: 100%;
    }
}
.background {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
