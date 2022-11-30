<template>
    <ViewComponent
        title="Run Capture areas"
        subtitle="This logs the captured areas to the console"
        :loading="true"
    >
        <template v-slot:default> Running ? </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent.vue';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
    console.log('start Capturing');
});

onUnmounted(() => {
    console.log('stop Capturing - close all');
});
</script>

<style lang="scss" scoped></style>
