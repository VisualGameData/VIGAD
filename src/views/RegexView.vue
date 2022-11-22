<template>
  <ViewComponent
    title="Regular Expressions"
    subtitle="Define what values are search for and where they are found."
    :loading="true"
  >
    <template v-slot:default>
      <v-expansion-panels class="mb-6" multiple>
        <v-expansion-panel v-for="i in 3" :key="i">
          <v-expansion-panel-title expand-icon="mdi-menu-down">
            Capture area {{ i }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <!-- Used components -->
            <CaptureAreaMetaProperties />
            <CaptureAreaSearchValue />
            <CaptureAreaSearchValue />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent.vue'
import CaptureAreaMetaProperties from '@/components/capture-area/CaptureAreaMetaProperties.vue'
import CaptureAreaSearchValue from '@/components/capture-area/CaptureAreaSearchValue.vue'
</script>

<style lang="scss" scoped></style>
