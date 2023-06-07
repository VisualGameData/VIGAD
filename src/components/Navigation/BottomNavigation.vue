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
import useRunning from '@/composables/useRunning/useRunning';
import SettingsPrompt from '@/components/SettingsPrompt/SettingsPrompt.vue';
import useLogger from '@/composables/useLogger/useLogger';

const { addLog } = useLogger();

// Use the useRunning composable to get the isRunning state
const { isRunning } = useRunning();
</script>

<style lang="scss" scoped></style>
