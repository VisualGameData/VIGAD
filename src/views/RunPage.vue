<template>
    <ViewComponent
        title="Run Capture areas"
        subtitle="This logs the captured areas to the console"
        :loading="isRunning"
    >
        <template v-slot:actions>
            <v-btn
                v-if="!isRunning"
                color="primary"
                width="100%"
                prepend-icon="mdi-play"
                variant="tonal"
                @click="useRunning().start()"
                >Start capturing</v-btn
            >
            <v-btn
                v-else
                color="primary"
                width="100%"
                prepend-icon="mdi-stop"
                variant="tonal"
                @click="useRunning().stop()"
                >Stop capturing</v-btn
            >
        </template>
        <template v-slot:default> Log here</template>
    </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent.vue';
import { useRunning, isRunning } from '@/composables/useRunning';
</script>

<style lang="scss" scoped></style>
