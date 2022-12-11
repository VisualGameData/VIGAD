<template>
    <ViewComponent title="Regex" :loading="false">
        <template v-slot:actions>
            <v-btn
                class="rounded-pill"
                prepend-icon="mdi-plus"
                variant="tonal"
                @click="addCaptureArea()"
                >Add Capture Area</v-btn
            >
        </template>
        <template v-slot:default>
            <v-expansion-panels multiple>
                <v-expansion-panel
                    v-if="isRerendering"
                    v-for="captureArea in captureAreas"
                    :key="captureArea.getId()"
                >
                    <v-expansion-panel-title
                        class="pa-4"
                        expand-icon="mdi-menu-down"
                    >
                        Capture area
                        {{ captureArea.getId() }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <CaptureAreaSearchValue />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ViewComponent from '@/components/ViewComponent.vue';
import CaptureAreaSearchValue from '@/components/capture-area/CaptureAreaSearchValue.vue';
import { Vigad } from '@/proc/Vigad';
import {
    isRerendering,
    useForceRerender,
} from '@/composables/useForceRerender';

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

/**
 * Get a reactive reference to all of the capture areas
 */
const captureAreas = ref(vigad.value.getAllCaptureAreas());

/**
 * Add a new capture area to the list of capture areas
 */
async function addCaptureArea() {
    vigad.value.addCaptureArea(100, 100, 0, 0);
    await useForceRerender();
}
</script>

<style lang="scss" scoped></style>
