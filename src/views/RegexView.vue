<template>
  <!-- Title thingy -->
  <v-sheet color="primary" rounded="rounded" class="pa-4 mx-auto"
    ><h2>Regular Expressions</h2>
    <p>Define what values are search for and where they are found.</p></v-sheet
  >
  <!-- Captur area thingy -->

  <v-expansion-panels class="mb-6">
    <v-expansion-panel v-for="i in 3" :key="i">
      <v-expansion-panel-title expand-icon="mdi-menu-down">
        Capture area {{ i }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <!-- Used components -->
        <CaptureAreaMetaProperties />
        <CaptureAreaSearchValue />
        <CaptureAreaSearchValue />
        <CaptureAreaSearchValue />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import CaptureAreaMetaProperties from '@/components/capture-area/CaptureAreaMetaProperties.vue'
import CaptureAreaSearchValue from '@/components/capture-area/CaptureAreaSearchValue.vue'
import CaptureAreaActions from '@/components/capture-area/CaptureAreaActions.vue'
</script>

<style lang="scss"></style>
