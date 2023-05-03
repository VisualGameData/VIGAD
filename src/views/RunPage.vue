<template>
    <ViewComponent title="Capturing" :loading="isRunning">
        <template v-slot:actions>
            <v-btn
                v-if="!isRunning"
                class="rounded-pill"
                prepend-icon="mdi-play"
                variant="tonal"
                :disabled="captureAreas.length === 0"
                @click="useRunning().start()"
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
            <v-expansion-panels v-model="defaultOpenPanel" multiple>
                <LogOutput
                    v-if="captureAreas.length !== 0"
                    v-for="captureArea in captureAreas"
                    :key="captureArea.getId()"
                    :captureAreaId="captureArea.getId()"
                />
                <v-alert
                    v-else
                    type="info"
                    variant="tonal"
                    prominent
                    text="To commence capturing, you must first define at least one capture area."
                ></v-alert>
            </v-expansion-panels>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRunning, isRunning } from '@/composables/useRunning';
import { Vigad } from '@/proc/Vigad';

import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';
import LogOutput from '@/components/LogOutput/LogOutput.vue';

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
