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

    <!-- The Subemnu Things -->
    <!-- TODO: create components out of this -->
    <v-navigation-drawer
      permanent
      v-model="isScreenOrApplicationSelectPanelOpen"
      temporary
      width="450"
    >
      <template v-slot:prepend>
        <v-sheet color="primary text-center" width="100%">
          <v-list>
            <v-list-item>Screen or Application</v-list-item>
          </v-list>
        </v-sheet>

        <div class="pa-2">
          <v-tabs
            v-model="tab"
            bg-color="primary"
            fixed-tabs
            class="rounded-lg"
          >
            <v-tab width="50%" value="screen">Screen</v-tab>
            <v-tab width="50%" value="application">Application</v-tab>
          </v-tabs>
        </div>
      </template>

      <div class="content-container pa-2">
        <v-window v-model="tab">
          <!-- TODO: add something that if nothing was found there is a message that nothing has been found -->
          <v-window-item value="screen">
            <!-- TODO: maybe create a component out ofthis -->
            <v-progress-circular
              v-if="isLoadingScreensAndWindows"
              color="primary"
              indeterminate
              :size="128"
              :width="12"
            ></v-progress-circular>
            <div v-show="!isLoadingScreensAndWindows" class="windows-wrapper">
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
            <v-progress-circular
              v-if="isLoadingScreensAndWindows"
              color="primary"
              indeterminate
              :size="128"
              :width="12"
            ></v-progress-circular>
            <div v-show="!isLoadingScreensAndWindows" class="windows-wrapper">
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

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="fetchAllStreams()" color="primary" width="100%" tonal
            >Refresh</v-btn
          >
        </div>
      </template>
    </v-navigation-drawer>

    <v-navigation-drawer permanent v-model="isRegexPanelOpen" temporary>
      <v-sheet color="primary text-center" width="100%">
        <v-list>
          <v-list-item>Regex Panel</v-list-item>
        </v-list>
      </v-sheet>
    </v-navigation-drawer>

    <!-- Main Content view-->
    <v-main>
      <v-container fluid> </v-container>
      <!-- Provides the application the proper gutter -->
      <v-container class="ma-0" fluid>
        <v-row>
          <v-col cols="4">
            <v-sheet min-height="70vh" rounded="lg">
              <!-- TODO: add transition to router view -->
              <router-view />
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              Video Element here
              <VideoStreamVue />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation grow>
      <v-btn to="/" tonal color="success" prepend-icon="mdi-play" value="run">
        Start Capturing
      </v-btn>

      <v-btn
        to="/sources"
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

      <v-btn
        to="/sessions"
        tonal
        color="success"
        prepend-icon="mdi-application-edit-outline"
        value="session"
      >
        Session
      </v-btn>

      <v-btn
        to="/settings"
        tonal
        color="success"
        prepend-icon="mdi-cog"
        value="settings"
      >
        Settings
      </v-btn>

      <v-btn
        to="/account"
        tonal
        color="success"
        prepend-icon="mdi-account"
        value="account"
      >
        Account
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import VideoStreamVue from './components/VideoStream.vue'

// TODO: create a store for this ?
// Here are only some of the properties
// TODO: only one panel at the time can be open

const isScreenOrApplicationSelectPanelOpen = ref(false)
const toggleScreenOrApplicationSelectPanel = () => {
  if (isScreenOrApplicationSelectPanelOpen.value) {
    isScreenOrApplicationSelectPanelOpen.value = false
  } else {
    // Open the panel
    isScreenOrApplicationSelectPanelOpen.value = true
    // Fetch the screens and windows
    // TODO: handel if already stored
    fetchAllStreams()
  }
}
const isRegexPanelOpen = ref(false)
const toggleRegexPanel = () => {
  isRegexPanelOpen.value = !isRegexPanelOpen.value
}

const theme = ref('dark')
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
// For the Screen / Application Tab
const tab = ref(null)

// Screen Capture API things
const dialog = ref(false)
const isLoadingScreensAndWindows = ref(false)

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

onMounted(() => {
  // fetch currenty available screens and windows on startup
  // aswell as the current selected source
  fetchAllStreamsAndSetMainVideo()
  console.log(useRouter())
})

/**
 * Clear the sources array
 */
function clearSources() {
  desktopCaptureSources.value = []
  // Preview the source in a video element
  const videoElement: HTMLVideoElement | null =
    document.querySelector('#mainVideo')
  videoElement!.srcObject = null

  dialog.value = false
}

async function fetchAllStreamsAndSetMainVideo() {
  // Fetch the screens and windows
  await fetchAllStreams()

  // Preview the source in a video element
  const mainScreen = computed(() =>
    desktopCaptureSources.value.find((source) => source.id === 'screen:0:0')
  )
  await selectSource(mainScreen.value)
}

/**
 * Get all available sources
 */
async function fetchAllStreams() {
  isLoadingScreensAndWindows.value = true
  await getVideoSources()
  console.log(desktopCaptureSources.value)
  await loadStreamSources()
  isLoadingScreensAndWindows.value = false
}

/**
 * Get all the video sources available on the system
 */
async function getVideoSources() {
  // TODO: is not called again if new sources showes up
  // Get the available video sources
  desktopCaptureSources.value = await (window as any).electronAPI.getMedia()
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

/**
 * Load the stream sources
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
  selectedSource.value = source

  // Preview the source in a video element
  const videoElement: HTMLVideoElement | null =
    document.querySelector('#mainVideo')

  setSourceForVideoNode(source, videoElement)
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
</style>
