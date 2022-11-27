<template>
    <div class="windows-wrapper">
        <v-card
            v-for="(source, index) in desktopVideoStreamSources"
            :key="source.id"
            @click="streamHandler.setCurrentSelectedSource(streams[index])"
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

    <!-- <div class="pa-2">
        <v-tabs v-model="tab" bg-color="primary" fixed-tabs class="rounded-lg">
            <v-tab width="50%" value="screen">Screen</v-tab>
            <v-tab width="50%" value="application">Application</v-tab>
        </v-tabs>
    </div>

    <div class="content-container pa-2">
        <v-window v-model="tab">
            <v-window-item value="screen">
                <v-progress-circular
                    color="primary"
                    indeterminate
                    :size="128"
                    :width="12"
                ></v-progress-circular>
                <div class="windows-wrapper">
                    <v-card
                        v-for="(source, index) in desktopVideoStreamSources"
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
                                :src-object.prop.camel="
                                    streamHandler.getMediaStreamFromSource(
                                        source
                                    )
                                "
                                class="preview"
                            ></video>
                        </v-card-text>
                    </v-card>
                </div>
            </v-window-item>

            <v-window-item value="application">
                <v-progress-circular
                    v-if="isLoadingScreensAndWindows"
                    color="primary"
                    indeterminate
                    :size="128"
                    :width="12"
                ></v-progress-circular>
                <div
                    v-show="!isLoadingScreensAndWindows"
                    class="windows-wrapper"
                >
                    <v-card
                        v-for="(source, index) in desktopVideoStreamSources"
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
                                :src-object.camel.prop="streams[index]"
                                class="preview"
                            ></video>
                        </v-card-text>
                    </v-card>
                </div>
            </v-window-item>
        </v-window>

        <v-progress-circular
          v-if="isLoadingScreensAndWindows"
          color="primary"
          indeterminate
          :size="128"
          :width="12"
        ></v-progress-circular>
        <div v-show="!isLoadingScreensAndWindows">
          <v-card
            v-for="source in desktopCaptureSources"
            :key="source.id"
            @click="streamHandler.setCurrentSelectedSource(source)"
            variant="tonal"
            class="mb-2"
          >
            <v-card-title>{{ source.name }}</v-card-title>
            <v-card-text>
              <video
                autoplay
                :src-object.camel.prop="streams[index]"
                class="preview"
              ></video>
            </v-card-text>
          </v-card>
        </div>
    </div> -->

    <div class="pa-2">
        <v-btn @click="fetchAllStreams()" color="primary" width="100%" tonal
            >Refresh</v-btn
        >
    </div>
</template>

<script setup lang="ts">
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

<style lang="scss" scoped></style>
