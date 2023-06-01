<template>
    <ViewComponent title="Sources" :loading="isLoadingScreensAndApplications">
        <template #actions>
            <v-btn
                class="rounded-pill"
                prepend-icon="mdi-refresh"
                variant="tonal"
                :disabled="isLoadingScreensAndApplications"
                @click="fetchAllDesktopCapturableSources()"
                >Refresh</v-btn
            >
        </template>
        <template #default>
            <v-tabs v-model="tabs" class="mb-4" color="primary" grow>
                <v-tab width="50%" value="screens"> Screens </v-tab>

                <v-tab width="50%" value="applications"> Applications </v-tab>
            </v-tabs>

            <div class="card-list-wrapper">
                <div
                    v-if="!isLoadingScreensAndApplications"
                    class="windows-wrapper"
                >
                    <v-window v-model="tabs">
                        <v-window-item value="screens">
                            <div
                                v-if="!isLoadingScreensAndApplications"
                                class="windows-wrapper"
                            >
                                <v-card
                                    v-for="source in onlyScreenSources"
                                    :key="(source as any).id"
                                    class="mb-2"
                                    @click="
                                        setPreviewVideoStream(
                                            mediaStreamsMap[(source as any).id]
                                        )
                                    "
                                >
                                    <v-card-title>{{
                                        (source as any).name
                                    }}</v-card-title>
                                    <v-card-text>
                                        <video
                                            autoplay
                                            :src-object.prop.camel="mediaStreamsMap[(source as any).id]"
                                            class="preview"
                                        ></video>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </v-window-item>

                        <v-window-item value="applications">
                            <div
                                v-if="!isLoadingScreensAndApplications"
                                class="windows-wrapper"
                            >
                                <v-card
                                    v-for="source in onlyApplicationSources"
                                    :key="(source as any).id"
                                    class="mb-2"
                                    @click="
                                        setPreviewVideoStream(
                                            mediaStreamsMap[(source as any).id]
                                        )
                                    "
                                >
                                    <v-card-title>{{
                                        (source as any).name
                                    }}</v-card-title>
                                    <v-card-text>
                                        <video
                                            autoplay
                                            :src-object.prop.camel="mediaStreamsMap[(source as any).id]
                                            "
                                            class="preview"
                                        ></video>
                                    </v-card-text>
                                </v-card>
                            </div>
                        </v-window-item>
                    </v-window>
                </div>
                <div v-else class="mr-2 ml-2 max-height">
                    <div class="circular-loading">
                        <v-progress-circular
                            :size="70"
                            :width="10"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </div>
                </div>
            </div>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';
import useStreamHandler from '@/composables/useStreamHandler/useStreamHandler';

// For the Screen / Application Tab
const tabs = ref(null);

// Stream and application sources
const {
    isLoadingScreensAndApplications,
    mediaStreamsMap,
    onlyScreenSources,
    onlyApplicationSources,
    setPreviewVideoStream,
    fetchAllDesktopCapturableSources,
} = useStreamHandler();

// Fetch all the desktop capturable sources on mount of the component so it always has the latest sources
onMounted(async () => {
    await fetchAllDesktopCapturableSources();
});
</script>

<style lang="scss" scoped>
.card-list-wrapper {
    height: calc(100vh - 56px - 16px - 16px - 68px - 16px - 68px);
    overflow: auto;

    .windows-wrapper {
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

        .preview {
            width: 100%;
            max-height: 180px;
        }
    }

    .max-height {
        height: 100%;
    }

    .circular-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
}
</style>
