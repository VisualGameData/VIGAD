<template>
    <v-expansion-panel class="log-output-container">
        <v-expansion-panel-title class="pa-4" expand-icon="mdi-menu-down">
            Capture area
            {{ captureAreaId }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <p v-if="matchedElementsIsEmpty">Start capturing first!</p>
            <v-list v-else lines="three" disabled class="reverse">
                <v-list-item v-for="(item, i) in matchedElements" :key="i">
                    <template #prepend>
                        <v-icon
                            :color="item.rating > 0 ? 'success' : 'error'"
                            icon="mdi-information"
                        ></v-icon>
                    </template>

                    <v-list-item-title expand-icon="mdi-menu-down">
                        {{ item.timestamp }}</v-list-item-title
                    >
                    <div>Element: {{ item.match.element }}</div>
                    <div>Rating: {{ item.rating }}</div>
                </v-list-item>
            </v-list>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Vigad } from '@/proc/Vigad';
import { MatchedElement } from '@/proc/MatchedElement';
import useRunning from '@/composables/useRunning/useRunning';

const props = defineProps<{
    captureAreaId: string;
}>();

// Use the useRunning composable to get the isRunning state and the start/stop functions
const { isRunning } = useRunning();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

const matchedElementsIsEmpty = computed(() => {
    return matchedElements.value.length === 0;
});

const matchedElements = ref<MatchedElement[]>([]);

// eslint-disable-next-line no-undef
let timerId: string | number | NodeJS.Timeout | undefined;

// watch for changes in isRunning and start/stop the timer
watch(isRunning, (newValue) => {
    if (newValue) {
        matchedElements.value = [];
        timerId = setTimeout(function tick() {
            let newFoundMatch: MatchedElement = vigad.value
                .getCaptureArea(props.captureAreaId)
                .getRegexGroups()[0]
                .getValueRegex()
                .getLastBestMatch();
            // add timestamp to the new value
            let date = new Date();
            let hours = date.getHours();
            let minutes = '0' + date.getMinutes();
            let seconds = '0' + date.getSeconds();
            newFoundMatch.timestamp =
                hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            // add new value to the array
            matchedElements.value.push(newFoundMatch);
            timerId = setTimeout(tick, 1000);
        }, 1000);
    } else {
        clearTimeout(timerId);
    }
});
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
