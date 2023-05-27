<template>
    <ViewComponent title="Sources" :loading="isLoadingScreensAndApplications">
        <template v-slot:actions>
            <v-btn class="rounded-pill" prepend-icon="mdi-refresh" variant="tonal"
                @click="fetchAllDesktopCapturableSources()" :disabled="isLoadingScreensAndApplications">Refresh</v-btn>
        </template>
        <template v-slot:default>
            <v-tabs v-model="tabs" class="mb-4" color="primary" grow>
                <v-tab width="50%" value="screens"> Screens </v-tab>

                <v-tab width="50%" value="applications"> Applications </v-tab>
            </v-tabs>

            <div v-if="!isLoadingScreensAndApplications" class="windows-wrapper">
                <v-window v-model="tabs">
                    <v-window-item value="screens">
                        <div v-if="!isLoadingScreensAndApplications" class="windows-wrapper">
                            <v-card v-for="(source, index) in onlyScreenSources" :key="(source as any).id" @click="
                                setPreviewVideoStream(mediaStreamsMap[(source as any).id])
                                " class="mb-2">
                                <v-card-title>{{ (source as any).name }}</v-card-title>
                                <v-card-text>
                                    <video autoplay :src-object.prop.camel="mediaStreamsMap[(source as any).id]"
                                        class="preview"></video>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-window-item>

                    <v-window-item value="applications">
                        <div v-if="!isLoadingScreensAndApplications" class="windows-wrapper">
                            <v-card v-for="(source, index) in onlyApplicationSources" :key="(source as any).id" @click="
                                setPreviewVideoStream(mediaStreamsMap[(source as any).id])
                                " class="mb-2">
                                <v-card-title>{{ (source as any).name }}</v-card-title>
                                <v-card-text>
                                    <video autoplay :src-object.prop.camel="mediaStreamsMap[(source as any).id]
                                        " class="preview"></video>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-window-item>
                </v-window>
            </div>
            <div v-else class="mr-2 ml-2">Loading ...</div>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';
import { ref } from 'vue';
import { useStreamHandler } from '@/composables/useStreamHandler/useStreamHandler';

// For the Screen / Application Tab
const tabs = ref(null);

// Stream and application sources
const { isLoadingScreensAndApplications, mediaStreamsMap, onlyScreenSources, onlyApplicationSources, setPreviewVideoStream, fetchAllDesktopCapturableSources } = useStreamHandler();
</script>

<style lang="scss" scoped>
// Video Sources PReview
.video-stream {
    width: 100%;
    height: 80vh;
    object-fit: cover;
}

.video {
    width: 100%;
}

.preview {
    width: 100%;
    max-height: 180px;
}

.windows-wrapper {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
</style>
