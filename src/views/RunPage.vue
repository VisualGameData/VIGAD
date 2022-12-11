<template>
    <ViewComponent title="Capturing" :loading="isRunning">
        <template v-slot:actions>
            <v-btn
                v-if="!isRunning"
                class="rounded-pill"
                prepend-icon="mdi-play"
                variant="tonal"
                @click="test()"
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
            <v-btn
                class="rounded-pill"
                prepend-icon="mdi-stop"
                variant="tonal"
                @click="abc()"
                >awdw</v-btn
            >
        </template>
        <template v-slot:default>
            <LogOutput
                title="Capture Area 1"
                log="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
            />
        </template>
    </ViewComponent>
</template>

<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import ViewComponent from '@/components/ViewComponent.vue';
import { useRunning, isRunning } from '@/composables/useRunning';
import LogOutput from '@/components/LogOutput.vue';
import { Vigad } from '@/proc/Vigad';

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

// vigad.getCaptureArea(id).getRegexGroups()[0].getValueRegex().getLastBestMatch()

const testd = ref(
    vigad.value
        .getCaptureArea(0)
        .getRegexGroups()[0]
        .getValueRegex()
        .getLastBestMatch()
);

function abc() {
    console.log(
        '->',
        vigad.value
            .getCaptureArea(0)
            .getRegexGroups()[0]
            .getValueRegex()
            .getLastBestMatch()
    );
}

function test() {
    useRunning().start();
}
</script>

<style lang="scss" scoped></style>
