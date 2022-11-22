<template>
  <v-card variant="tonal">
    <v-card-title>Source</v-card-title>
    <v-card-text class="video-stream">
      <v-responsive aspect-ratio="16 / 9" class="border">
        <video id="mainVideo" autoplay class="video" ref="target"></video>
      </v-responsive>
      <div>
        x: {{ x }} y: {{ y }} Is Outside: {{ isOutside }}

        Height: {{ height }} Width: {{ width }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getThings, allSources } from '../composable/useDesktopCapture'
import { useMouseInElement, useElementSize } from '@vueuse/core'
// Mouse position relative to the element and is in and out
const target = ref(null)
const { x, y, isOutside } = useMouseInElement(target)

// Element size
const { width, height } = useElementSize(target)

const dialog = ref(false)
const isLoadingScreensAndWindows = ref(false)

const desktopCaptureSources = ref([])
const selectedSource = ref(null)

onMounted(() => {
  // fetch currenty available screens and windows on startup
  // aswell as the current selected source
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

/**
 * Get all available sources
 */
async function doAll() {
  // Calling different function
  await getThings()
  console.log(allSources.value)

  isLoadingScreensAndWindows.value = true
  await getVideoSources()
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

<style lang="scss" scoped>
.video-stream {
  width: 100%;
  object-fit: cover;
}
.video {
  width: 100%;
}
</style>
