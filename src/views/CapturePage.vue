<template>
    <ViewComponent title="Capturing" :loading="isRunning">
        <template #actions>
            <v-btn
                v-if="!isRunning"
                class="rounded-pill"
                prepend-icon="mdi-play"
                variant="tonal"
                :disabled="captureAreas.length === 0"
                @click="start()"
                >Start</v-btn
            >
            <v-btn
                v-else
                class="rounded-pill"
                prepend-icon="mdi-stop"
                variant="tonal"
                @click="stop()"
                >Stop</v-btn
            >
        </template>
        <template #default>
            <v-expansion-panels
                v-if="captureAreas.length !== 0"
                v-model="defaultOpenPanel"
                multiple
            >
                <LogOutput
                    v-for="captureArea in captureAreas"
                    :key="captureArea.getId()"
                    :capture-area-id="captureArea.getId()"
                />
            </v-expansion-panels>
            <v-alert
                v-else
                type="info"
                variant="tonal"
                prominent
                text="To commence capturing, you must first define at least one capture area."
            ></v-alert>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Vigad } from '@/proc/Vigad';
import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';
import LogOutput from '@/components/LogOutput/LogOutput.vue';
import useRunning from '@/composables/useRunning/useRunning';

// Use the useRunning composable to get the isRunning state and the start/stop functions
const { isRunning, start, stop } = useRunning();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

/**
 * Get a reactive reference to all of the capture areas
 */
const captureAreas = ref(vigad.value.getAllCaptureAreas());

const defaultOpenPanel = ref<number[]>([0]);
</script>

<style lang="scss" scoped>
.output {
    display: flex;
    justify-content: row;
}
</style>
