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
                @click="createCaptureAreaSelection()"
                >Create Capture Area</v-btn
            >
        </template>
        <template v-slot:default>
            <v-expansion-panels class="mb-6" multiple>
                <v-expansion-panel v-for="i in captureAreas" :key="i">
                    <v-expansion-panel-title expand-icon="mdi-menu-down">
                        Capture area {{ i }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <!-- Used components -->
                        <CaptureAreaMetaProperties />
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
import CaptureAreaMetaProperties from '@/components/capture-area/CaptureAreaMetaProperties.vue';
import CaptureAreaSearchValue from '@/components/capture-area/CaptureAreaSearchValue.vue';

// TODO: add new capture area to a object which is stored somewhere
const captureAreas = ref([1]);

function createCaptureAreaSelection() {
    console.log('createCaptureAreaSelection');
    // TODO: add new capture area to a object which is stored somewhere

    // Simple implementation how it could work
    captureAreas.value.push(captureAreas.value.length + 1);
}
</script>

<style lang="scss" scoped></style>
