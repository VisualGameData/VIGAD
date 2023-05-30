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
            <v-expansion-panels v-if="captureAreas.length !== 0" multiple>
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
                        <CaptureAreaSearchValue
                            :capture-area-id="captureArea.getId()"
                        />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-alert
                v-else
                type="info"
                variant="tonal"
                prominent
                text="In order to locate a value within the stream, you must create a capture area."
            ></v-alert>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';
import CaptureAreaSearchValue from '@/components/capture-area/CaptureAreaSearchValue/CaptureAreaSearchValue.vue';
import { Vigad } from '@/proc/Vigad';
import useForceRerender from '@/composables/useForceRerender/useForceRerender';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

/**
 * Use the useForceRerender composable to get the isRerendering state and the forceRerender functions
 */
const { isRerendering, forceRerender } = useForceRerender();

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
    await forceRerender();
    useNotificationSystem().createNotification({
        title: 'New Capture Area added',
    });
}
</script>

<style lang="scss" scoped></style>
