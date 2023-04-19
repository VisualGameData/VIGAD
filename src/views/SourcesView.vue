<template>
    <ViewComponent title="Sources" :loading="isLoadingScreensAndWindows">
        <template v-slot:actions>
            <v-btn
                class="rounded-pill"
                prepend-icon="mdi-refresh"
                variant="tonal"
                @click="fetchAllStreams()"
                :disabled="isLoadingScreensAndWindows"
                >Refresh</v-btn
            >
        </template>
        <template v-slot:default>
            <v-tabs v-model="tabs" class="mb-4" color="primary" grow>
                <v-tab width="50%" value="screens"> Screens </v-tab>

                <v-tab width="50%" value="applications"> Applications </v-tab>
            </v-tabs>

            <div v-if="!isLoadingScreensAndWindows" class="windows-wrapper">
                <v-window v-model="tabs">
                    <v-window-item value="screens">
                        <div
                            v-if="!isLoadingScreensAndWindows"
                            class="windows-wrapper"
                        >
                            <v-card
                                v-for="(source, index) in onlyScreenSources"
                                :key="source.id"
                                @click="
                                    streamHandler.setCurrentSelectedSource(
                                        streams[index]
                                    )
                                "
                                class="mb-2"
                            >
                                <v-card-title>{{ source.name }}</v-card-title>
                                <v-card-text>
                                    <video
                                        autoplay
                                        :src-object.prop.camel="streams[index]"
                                        class="preview"
                                    ></video>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-window-item>

                    <v-window-item value="applications">
                        <div
                            v-if="!isLoadingScreensAndWindows"
                            class="windows-wrapper"
                        >
                            <v-card
                                v-for="(
                                    source, index
                                ) in onlyApplicationSources"
                                :key="source.id"
                                @click="
                                    streamHandler.setCurrentSelectedSource(
                                        streams[lastScreenIndex + index]
                                    )
                                "
                                class="mb-2"
                            >
                                <v-card-title>{{ source.name }}</v-card-title>
                                <v-card-text>
                                    <video
                                        autoplay
                                        :src-object.prop.camel="
                                            streams[lastScreenIndex + index]
                                        "
                                        class="preview"
                                    ></video>
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
import { ref, computed, onMounted } from 'vue';
import { Vigad } from '@/proc/Vigad';

// Get singelton instance reference to vigad
const vigad = ref(Vigad.getInstance());

// Get singelton instance reference to streamHandler
const streamHandler = vigad.value.getStreamHandlerInstance();

// For the Screen / Application Tab
const tabs = ref(null);

// Get all desktop video stream sources
const desktopVideoStreamSources = ref();

const onlyApplicationSources = ref();
const onlyScreenSources = ref();
const lastScreenIndex = computed(() => {
    return Object.keys(onlyScreenSources.value).length;
});

// All MediaStream sources
const streams = ref<MediaStream[]>([]);

// Is the application loading the screens and windows local propertie
const isLoadingScreensAndWindows = ref(false);

onMounted(() => {
    fetchAllStreams();
});

/**
 * Get all available sources
 */
async function fetchAllStreams() {
    isLoadingScreensAndWindows.value = true;

    // Reset all sources
    desktopVideoStreamSources.value = null;
    onlyApplicationSources.value = null;
    onlyScreenSources.value = null;

    // wait for the fetched screens and windows
    desktopVideoStreamSources.value =
        await streamHandler.getScreenAndApplicationSources();

    // TODO: testing
    onlyApplicationSources.value =
        await streamHandler.getOnlyApplicationSources();

    onlyScreenSources.value = await streamHandler.getOnlyScreenSources();

    // Loop through all sources and set the MediaStream to video nodes
    Array.from(desktopVideoStreamSources.value).forEach(function (element) {
        setSourceForVideoNode(element);
    });

    isLoadingScreensAndWindows.value = false;
}

async function setSourceForVideoNode(source: any) {
    const constraints: any = {
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
            },
        },
    };

    streams.value.push(await navigator.mediaDevices.getUserMedia(constraints));
}
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
