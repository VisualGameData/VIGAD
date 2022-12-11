<template>
    <ViewComponent title="Capturing" :loading="isRunning">
        <template v-slot:actions>
            <v-btn
                v-if="!isRunning"
                class="rounded-pill"
                prepend-icon="mdi-play"
                variant="tonal"
                @click="useRunning().start()"
                >Start</v-btn
            >
            <v-btn
                v-else
                class="rounded-pill"
                prepend-icon="mdi-stop"
                variant="tonal"
                @click="useRunning().stop()"
                >Stop</v-btn
            >
        </template>
        <template v-slot:default>
            <v-alert density="compact" type="success" closable>
                The interpretation was a success.
            </v-alert>

            <br />

            <v-alert
                border="start"
                density="compact"
                icon="mdi-information"
                title="Success"
                variant="elevated"
                type="success"
                closable
            >
                The interpretation was a success.
            </v-alert>

            <br />

            <v-alert border="start" density="compact" type="info" closable>
                I'm an info alert.
            </v-alert>

            <br />

            <v-alert
                border="start"
                density="compact"
                title="Info"
                type="info"
                closable
            >
                I'm an info alert.
            </v-alert>

            <br />

            <v-alert
                border="start"
                density="compact"
                title="Warning"
                type="warning"
                closable
            >
                I'm a warning alert.
            </v-alert>

            <br />

            <v-alert
                border="start"
                density="compact"
                title="Error"
                type="error"
                closable
            >
                Something whent wrong!
            </v-alert>
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import ViewComponent from '@/components/ViewComponent.vue';
import { useRunning, isRunning } from '@/composables/useRunning';
</script>

<style lang="scss" scoped></style>
