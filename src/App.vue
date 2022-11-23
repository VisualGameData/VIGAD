<template>
  <v-app :theme="theme">
    <v-system-bar class="pa-0 ma-0 drag" color="surface" height="30">
      <span>Vigad v1.0</span>

      <v-spacer></v-spacer>

      <v-btn
        @click="minimizeScreen()"
        icon="mdi-minus"
        variant="tonal"
        size="x-small"
        class="rounded-0"
        height="30"
      ></v-btn>

      <v-btn
        @click="fullScreen()"
        icon="mdi-checkbox-blank-outline"
        variant="tonal"
        class="rounded-0"
        size="x-small"
        height="30"
      ></v-btn>

      <v-btn
        @click="closeApplication()"
        icon="mdi-close"
        variant="tonal"
        class="rounded-0"
        size="x-small"
        color="error"
        width="50"
        height="30"
      ></v-btn>
    </v-system-bar>

    <!-- Main Content view-->
    <v-main>
      <v-container fluid> </v-container>
      <!-- Provides the application the proper gutter -->
      <v-container class="ma-0 pt-0 pb-0" fluid>
        <v-row cols="12" no-gutters>
          <v-col cols="5">
            <v-sheet
              class="changing-view"
              min-height="80vh"
              max-height="80vh"
              rounded="lg"
            >
              <!-- TODO: add transition to router view -->
              <router-view />
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="80vh" max-height="80vh" rounded="lg">
              <VideoStreamVue />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation grow>
      <v-btn
        to="/run"
        tonal
        color="success"
        prepend-icon="mdi-play"
        value="run"
      >
        Start Capturing
      </v-btn>

      <v-btn
        to="/"
        tonal
        color="success"
        prepend-icon="mdi-monitor"
        value="source"
      >
        Source
      </v-btn>

      <v-btn
        to="/regex"
        tonal
        color="success"
        prepend-icon="mdi-regex"
        value="regex"
      >
        Regex
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { DesktopVideoStream } from './proc/DesktopVideoStream'

import VideoStreamVue from './components/VideoStream.vue'

const theme = ref('dark')

// let desktopVideoStream = new DesktopVideoStream()
const desktopVideoStream = DesktopVideoStream.getInstance()

onMounted(() => {
  // fetch all sources at the time of mounting/application
  fetchAllStreamsAndSetMainVideo()
})

// fetches everything and sets the main video stream to the main screen
async function fetchAllStreamsAndSetMainVideo() {
  // Fetch the screens and windows
  desktopVideoStream.setIsLoadingScreensAndApplications(true)

  await desktopVideoStream.fetchAllMediaStreams()

  // set the main video stream to the main screen
  await selectSource(desktopVideoStream.getMainScreenSource())

  desktopVideoStream.setIsLoadingScreensAndApplications(false)
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

// Handle System Bar Functions
async function minimizeScreen() {
  await (window as any).electronAPI.minimizeScreen()
}

async function fullScreen() {
  await (window as any).electronAPI.fullScreen()
}

async function closeApplication() {
  await (window as any).electronAPI.closeApplication()
}
</script>

<style lang="scss">
@import './styles/variables.scss';

// transforms the variables into css variables
:root {
  @each $colorname, $palette in $palettes {
    @each $key, $value in $palette {
      $keyname: '--palette-' + $colorname + '-' + $key;
      #{$keyname}: #{$value};
    }
  }
}

*,
:after,
:before {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body,
html {
  width: 100%;
  height: 100%;
  font-family: YouTube Sans, Roboto, sans-serif;
}

body {
  position: relative;
  min-height: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
  user-select: none;
}

.drag {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}

// Video Sources PReview
.video-stream {
  width: 100%;
  height: 77vh;
  object-fit: cover;
}
.video {
  width: 100%;
}
.preview {
  width: 100%;
  height: 180px;
}
.windows-wrapper {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.window {
  width: 100%;
  background-color: red;
  margin: 5px 0;
  cursor: pointer;
}
.changing-view {
  overflow-y: scroll;
}
</style>
