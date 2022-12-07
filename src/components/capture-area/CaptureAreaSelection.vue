<template>
    <Draggable
        v-slot="{ x, y }"
        class="capture-area-selection"
        :initial-value="{ x: xParent / 2, y: yParent / 2 }"
        :handle="handle"
        ref="draggable"
    >
        <div ref="handle" class="cursor-move">👋 Drag here!</div>
        <div class="text-xs opacity-50">
            Handle that triggers the drag event
        </div>
        <div>{{ height }}</div>
        <div>{{ width }}</div>
        <!-- <div>{{ mouseRelativToStreamPreview.x }}</div> -->
        <!-- <div>{{ mouseRelativToStreamPreview.y }}</div> -->
        <v-btn @click="changeSize">Create Dragable</v-btn>
    </Draggable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { isClient } from '@vueuse/shared';
import { useElementSize, useMouse } from '@vueuse/core';
import { UseDraggable as Draggable } from '@vueuse/components';

const props = defineProps<{
    xParent: number;
    yParent: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}>();

const handle = ref<HTMLElement | null>(null);
const innerWidth = isClient ? window.innerWidth : 200;

const draggable = ref(null);
const { width, height } = useElementSize(draggable);
const { x: xMouse, y: yMouse, sourceType } = useMouse();

const mouseRelativToStreamPreview = computed(() => {
    return {
        x: xMouse.value - props.xParent,
        y: yMouse.value - props.yParent,
    };
});

const mouseRelativToStreamPreviewX = ref(xMouse.value - props.xParent);

const mouseRelativToStreamPreviewY = ref(yMouse.value - props.yParent);

function changeSize() {
    console.log(draggable.value);
}
</script>

<style lang="scss" scoped>
.capture-area-selection {
    resize: both;
    position: absolute;
    overflow: hidden;
    background-color: red;
    width: 200px;
    height: 200px;
}
.cursor-move {
    cursor: move;
}
</style>
