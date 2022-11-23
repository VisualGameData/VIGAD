<template>
  <div class="video-stream">
    <v-responsive aspect-ratio="16 / 9" class="border">
      <video id="mainVideo" autoplay class="video" ref="target"></video>
    </v-responsive>
    <div>
      x: {{ x }} y: {{ y }} Is Outside: {{ isOutside }}

      Height: {{ height }} Width: {{ width }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMouseInElement, useElementSize } from '@vueuse/core'
// Mouse position relative to the element and is in and out
const target = ref(null)
const { x, y, isOutside } = useMouseInElement(target)

// Element size
const { width, height } = useElementSize(target)
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
