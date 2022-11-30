<template>
    <ViewComponent
        title="Sources"
        subtitle="Show you all the available screen and application sources"
        :loading="true"
    >
        <template v-slot:default>
            <div class="windows-wrapper">
                <v-card
                    v-for="(source, index) in desktopVideoStreamSources"
                    :key="source.id"
                    @click="
                        streamHandler.setCurrentSelectedSource(streams[index])
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
            <div class="pa-2">
                <v-btn
                    @click="fetchAllStreams()"
                    color="primary"
                    width="100%"
                    tonal
                    >Refresh</v-btn
                >
            </div>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent.vue';
import { ref, computed, onMounted } from 'vue';
import { StreamHandler } from '@/proc/StreamHandler';

// Get singelton instance of DesktopVideoStream
const streamHandler = StreamHandler.getInstance();

// For the Screen / Application Tab
const tab = ref(null);

// Get all desktop video stream sources
const desktopVideoStreamSources = ref();

// All MediaStream sources
const streams = ref<MediaStream[]>([]);

const isLoadingScreensAndWindows = computed(() => {
    return streamHandler.getIsLoadingScreensAndApplications();
});

onMounted(() => {
    fetchAllStreams();
});

/**
 * Get all available sources
 */
async function fetchAllStreams() {
    // wait for the fetched screens and windows
    desktopVideoStreamSources.value =
        await streamHandler.getScreenAndApplicationSources();

    // Loop through all sources and set the MediaStream to video nodes
    Array.from(desktopVideoStreamSources.value).forEach(function (element) {
        setSourceForVideoNode(element);
    });
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
