<template>
    <v-bottom-navigation :elevation="24" bg-color="surface" grow>
        <v-btn
            :disabled="isRunning"
            to="/capture"
            prepend-icon="mdi-play"
            value="run"
        >
            Capturing
        </v-btn>

        <v-btn
            :disabled="isRunning"
            to="/"
            prepend-icon="mdi-monitor"
            value="source"
        >
            Source
        </v-btn>

        <v-btn
            :disabled="isRunning"
            to="/regex"
            prepend-icon="mdi-regex"
            value="regex"
        >
            Regex
        </v-btn>

        <SettingsPrompt />
    </v-bottom-navigation>
</template>

<script setup lang="ts">
import { isRunning } from '@/composables/useRunning/useRunning';
import SettingsPrompt from '@/components/SettingsPrompt/SettingsPrompt.vue';
</script>

<style lang="scss" scoped></style>
