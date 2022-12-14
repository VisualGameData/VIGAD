<template>
    <ViewComponent title="Capturing" :loading="isRunning">
        <template v-slot:actions>
            <v-btn
                v-if="!isRunning"
                class="rounded-pill"
                prepend-icon="mdi-play"
                variant="tonal"
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
            <v-alert v-if="isRunning" class="mb-4" type="warning"
                >While capturing you are unable to switch changes sources or
                adjust regex, please stop if you want to change those!</v-alert
            >
            <v-expansion-panels multiple>
                <LogOutput
                    v-for="captureArea in captureAreas"
                    :key="captureArea.getId()"
                    :captureAreaId="captureArea.getId()"
                />
            </v-expansion-panels>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
</script>

<style lang="scss" scoped>
.output {
    display: flex;
    justify-content: row;
}
</style>
