<template>
    <v-card class="log-output-container mb-4">
        <v-card-title>{{ `Capture Area ${captureAreaId}` }}</v-card-title>
        <v-list lines="three" disabled class="reverse">
            <v-list-item v-for="(item, i) in matchedElements" :key="i">
                <template v-slot:prepend>
                    <v-icon color="primary" icon="mdi-information"></v-icon>
                </template>

                <v-list-item-title> {{ getCurrentTime() }}</v-list-item-title>
                <v-list-item-subtitle>
                    <div>Element: {{ item.match.element }}</div>
                    <div>Rating: {{ item.rating }}</div>
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Vigad } from '@/proc/Vigad';
import { isRunning } from '@/composables/useRunning';

const props = defineProps<{
    captureAreaId: number;
}>();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

// local interface otherwise typescript is complaining
interface MatchedElement {
    match: {
        index: number;
        element: string;
    };
    rating: number;
}

const matchedElements = ref<MatchedElement[]>([]);

let timerId: string | number | NodeJS.Timeout | undefined;

// watch for changes in isRunning and start/stop the timer
watch(isRunning, (newValue) => {
    if (newValue) {
        timerId = setTimeout(function tick() {
            let newValue: MatchedElement = vigad.value
                .getCaptureArea(0)
                .getRegexGroups()[0]
                .getValueRegex()
                .getLastBestMatch();
            console.log(Math.floor(Date.now() / 1000));
            matchedElements.value.push(newValue);
            timerId = setTimeout(tick, 1000);
        }, 1000);
    } else {
        clearTimeout(timerId);
    }
});

function getCurrentTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = '0' + date.getMinutes();
    let seconds = '0' + date.getSeconds();
    let formattedTime =
        hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}
</script>

<style lang="scss" scoped>
.log-output-container {
    max-height: 400px;
    overflow-y: auto;
}
.reverse {
    display: flex;
    flex-direction: column-reverse;
}
</style>
