<template>
  <div class="pa-2">
    <v-tabs v-model="tab" bg-color="primary" fixed-tabs class="rounded-lg">
      <v-tab width="50%" value="screen">Screen</v-tab>
      <v-tab width="50%" value="application">Application</v-tab>
    </v-tabs>
  </div>

  <div class="content-container pa-2">
    <v-window v-model="tab">
      <v-window-item value="screen">
        <!-- v-if="isLoadingScreensAndWindows" -->
        <v-progress-circular
          color="primary"
          indeterminate
          :size="128"
          :width="12"
        ></v-progress-circular>
        <!-- v-show="!isLoadingScreensAndWindows" -->
        <div class="windows-wrapper">
          <v-card
            v-for="source in screenSources"
            :key="source.id"
            @click="selectSource(source)"
            variant="tonal"
            class="mb-2"
          >
            <v-card-title>{{ source.name }}</v-card-title>
            <v-card-text>
              <video
                autoplay
                :src-object.camel.prop="getStreamSource(source)"
                class="preview"
              ></video>
            </v-card-text>
          </v-card>
        </div>
      </v-window-item>

      <v-window-item value="application">
        <!-- TODO: Video preview isnt loaded on start  -->
        <!-- v-if="isLoadingScreensAndWindows" -->
        <v-progress-circular
          color="primary"
          indeterminate
          :size="128"
          :width="12"
        ></v-progress-circular>
        <!-- v-show="!isLoadingScreensAndWindows" -->
        <div class="windows-wrapper">
          <v-card
            v-for="source in applicationSources"
            :key="source.id"
            @click="selectSource(source)"
            variant="tonal"
            class="mb-2"
          >
            <v-card-title>{{ source.name }}</v-card-title>
            <v-card-text>
              <video
                autoplay
                :src-object.camel.prop="getStreamSource(source)"
                class="preview"
              ></video>
            </v-card-text>
          </v-card>
        </div>
      </v-window-item>
    </v-window>

    <!-- <v-progress-circular
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
            @click="selectSource(source)"
            variant="tonal"
            class="mb-2"
          >
            <v-card-title>{{ source.name }}</v-card-title>
            <v-card-text>
              <video
                autoplay
                :src-object.camel.prop="getStreamSource(source)"
                class="preview"
              ></video>
            </v-card-text>
          </v-card>
        </div> -->
  </div>

  <div class="pa-2">
    <v-btn @click="test()" color="primary" width="100%" tonal>Refresh</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { DesktopVideoStream } from '@/proc/DesktopVideoStream'

// For the Screen / Application Tab
const tab = ref(null)

// Screen Capture API things
const isLoadingScreensAndWindows = computed(() => {
  return desktopVideoStream.getIsLoadingScreensAndApplications()
})

const desktopCaptureSources = ref([])
const selectedSource = ref(null)

const screenSources = computed(() =>
  desktopCaptureSources.value.filter(
    (source) => source.id.substring(0, source.id.indexOf(':')) === 'screen'
  )
)

const applicationSources = computed(() =>
  desktopCaptureSources.value.filter(
    (source) => source.id.substring(0, source.id.indexOf(':')) === 'window'
  )
)

const newScreenSources = ref()
const newApplicationSources = ref()

// Get singelton instance of DesktopVideoStream
const desktopVideoStream = DesktopVideoStream.getInstance()

onMounted(() => {
  // fetch currenty available screens and windows on startup
  // aswell as the current selected source
  fetchAllStreams()
  // LOAD Screen and Window Sources
})

/**
 * Get all available sources
 */
async function fetchAllStreams() {
  desktopVideoStream.setIsLoadingScreensAndApplications(true)

  // Fetch the screens and windows for the newest values
  await desktopVideoStream.fetchAllMediaStreams()

  newScreenSources.value = desktopVideoStream.getOnlyScreenSources()
  newApplicationSources.value = desktopVideoStream.getOnlyApplicationSources()

  // show all the screens and windows
  await getVideoSources()

  await loadStreamSources()

  desktopVideoStream.setIsLoadingScreensAndApplications(false)
}

/**
 * Get all the video sources available on the system
 */
async function getVideoSources() {
  // TODO: is not called again if new sources showes up
  // Get the available video sources
  // desktopCaptureSources.value = await (window as any).electronAPI.getMedia()
  desktopCaptureSources.value = await (window as any).electronAPI.getMedia()
  console.log(desktopCaptureSources.value)
}

/**
 * Load the proper media stream source for the video element
 */
async function loadStreamSources() {
  // Is there a better way then this?
  const videoElements: HTMLVideoElement | null =
    document.querySelectorAll('.preview')

  Array.from(videoElements).forEach(function (video, index) {
    setSourceForVideoNode(desktopCaptureSources.value[index], video)
  })
}

async function test() {
  const videoElements: HTMLVideoElement | null =
    document.querySelectorAll('.preview')

  console.log(videoElements)
}

/**
 * Load the stream sources into a video element
 * @param {any} source
 * @param {HTMLVideoElement} videoHTMLNode
 * @returns {Promise<void>}
 */
async function setSourceForVideoNode(source: any, videoNode: HTMLVideoElement) {
  const constraints: any = {
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      },
    },
  }

  // Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  // console.log(stream)
  // Preview the source in a video element
  videoNode.srcObject = stream
}

/**
 * Load a specific stream source as main video
 *
 * @param {any} source
 */
async function selectSource(source: any) {
  // Set the selected source
  desktopVideoStream.setCurrentSelectedSource(source)

  // Preview the source in a video element
  const videoElement: HTMLVideoElement | null =
    document.querySelector('#mainVideo')

  setSourceForVideoNode(source, videoElement!)
}

/**
 * Get the stream source
 * @param {string} sourceName
 */
async function getStreamSource(source: any) {
  const constraints: any = {
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      },
    },
  }

  // Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints)

  return stream
}
</script>

<style lang="scss" scoped></style>
