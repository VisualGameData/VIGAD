<template>
    <div>Running</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
onMounted(() => {
    console.log('start Capturing');
});

onUnmounted(() => {
    console.log('stop Capturing - close all');
});
</script>

<style lang="scss" scoped></style>
