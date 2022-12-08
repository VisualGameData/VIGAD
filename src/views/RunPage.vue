<template>
    <ViewComponent
        title="Run Capture areas"
        subtitle="This logs the captured areas to the console"
        :loading="isRunning"
    >
        <template v-slot:default>
            <v-btn @click="useRunning().start()">Start running</v-btn
            ><v-btn @click="useRunning().stop()">Stop running</v-btn></template
        >
    </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent.vue';
import { useRunning, isRunning } from '@/composables/useRunning';
</script>

<style lang="scss" scoped></style>
