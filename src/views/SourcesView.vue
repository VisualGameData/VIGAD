<template>
    <ViewComponent
        title="Sources"
        subtitle="Show you all the available screen and application sources"
        :loading="isLoadingScreensAndWindows"
    >
        <template v-slot:default>
            <v-tabs v-model="tabs" class="mb-4" color="primary" grow>
                <v-tooltip location="top" text="All screens">
                    <template v-slot:activator="{ props }">
                        <v-tab v-bind="props" value="screens">
                            <v-icon>mdi-monitor</v-icon>
                        </v-tab>
                    </template>
                </v-tooltip>

                <v-tooltip location="top" text="All applications">
                    <template v-slot:activator="{ props }">
                        <v-tab v-bind="props" value="applications">
                            <v-icon>mdi-application</v-icon>
                        </v-tab>
                    </template>
                </v-tooltip>
            </v-tabs>

            <div v-if="!isLoadingScreensAndWindows" class="windows-wrapper">
                <v-window v-model="tabs">
                    <v-window-item value="screens">
                        <v-btn
                            class="mb-4"
                            variant="plain"
                            width="100%"
                            prepend-icon="mdi-refresh"
                            @click="fetchAllStreams()"
                        >
                            Refresh
                        </v-btn>
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
                                variant="tonal"
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
                        <v-btn
                            class="mb-4"
                            variant="plain"
                            width="100%"
                            prepend-icon="mdi-refresh"
                            @click="fetchAllStreams()"
                        >
                            Refresh
                        </v-btn>
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
                                variant="tonal"
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
            <div v-else>Loading ...</div>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent.vue';
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
