<template>
    <ViewComponent
        title="Regular Expressions"
        subtitle="Define what values are search for and where they are found."
        :loading="true"
    >
        <template v-slot:actions>
            <v-btn
                color="primary"
                width="100%"
                prepend-icon="mdi-plus"
                variant="tonal"
                @click="addCaptureArea()"
                >Create Capture Area</v-btn
            >
        </template>
        <template v-slot:default>
            <v-expansion-panels class="mb-6" multiple>
                <v-expansion-panel
                    v-if="rerender"
                    v-for="captureArea in captureAreas"
                    :key="captureArea.getId()"
                >
                    <v-expansion-panel-title expand-icon="mdi-menu-down">
                        Capture area
                        <!-- {{ captureArea.getId() }} -->
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <!-- Used components -->
                        <!-- <CaptureAreaMetaProperties /> -->
                        <CaptureAreaSearchValue />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import ViewComponent from '@/components/ViewComponent.vue';
import CaptureAreaMetaProperties from '@/components/capture-area/CaptureAreaMetaProperties.vue';
import CaptureAreaSearchValue from '@/components/capture-area/CaptureAreaSearchValue.vue';
import { Vigad } from '@/proc/Vigad';
import { rerender, forceRerender } from '@/components/Rerender';

/**
 * Get singelton instance reference to vigad
 */
const vigad = Vigad.getInstance();

/**
 * Get a reactive reference to all of the capture areas
 */
const captureAreas = ref(vigad.getAllCaptureAreas());

/**
 * Add a new capture area to the list of capture areas
 */
async function addCaptureArea() {
    vigad.addCaptureArea(100, 100, 0, 0);
    await forceRerender();
}
</script>

<style lang="scss" scoped></style>
