<template>
    <ViewComponent title="Capturing" :loading="isRunning">
        <template v-slot:actions>
            <v-btn
                v-if="!isRunning"
                class="rounded-pill"
                prepend-icon="mdi-play"
                variant="tonal"
                @click="test()"
                >Start</v-btn
            >
            <v-btn
                v-else
                class="rounded-pill"
                prepend-icon="mdi-stop"
                variant="tonal"
                @click="useRunning().stop()"
                >Stop</v-btn
            >
        </template>
        <template v-slot:default>
            <LogOutput
                v-for="captureArea in captureAreas"
                :key="captureArea.getId()"
                :captureAreaId="captureArea.getId()"
            />
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import ViewComponent from '@/components/ViewComponent.vue';
import { useRunning, isRunning } from '@/composables/useRunning';
import LogOutput from '@/components/LogOutput.vue';
import { Vigad } from '@/proc/Vigad';

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

/**
 * Get a reactive reference to all of the capture areas
 */
const captureAreas = ref(vigad.value.getAllCaptureAreas());

function test() {
    useRunning().start();
}
</script>

<style lang="scss" scoped></style>
