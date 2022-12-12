<template>
    <!-- <v-alert
        border="start"
        icon="mdi-information"
        :title="title"
        type="success"
        class="log-output-container"
        variant="outlined"
    >
        {{ log }}
    </v-alert> -->
    <v-card class="log-output-container mb-4">
        <v-list lines="three" disabled>
            <v-list-subheader>{{
                `Capture Area ${captureAreaId}`
            }}</v-list-subheader>

            <v-list-item v-for="(item, i) in matchedElements" :key="i">
                <template v-slot:prepend>
                    <v-icon color="primary" icon="mdi-information"></v-icon>
                </template>

                <v-list-item-title> Iteration: {{ i }}</v-list-item-title>
                <v-list-item-subtitle>
                    <div>Element: {{ item.element }}</div>
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

const title = ref(`Capture Area ${props.captureAreaId}`);

const log = ref('');

const matchedElements = ref<Object[]>([]);

let timerId: string | number | NodeJS.Timeout | undefined;

watch(isRunning, (newValue) => {
    console.log(newValue);
    if (newValue) {
        log.value += 'start timer' + '\n';
        timerId = setTimeout(function tick() {
            let newValue = vigad.value
                .getCaptureArea(0)
                .getRegexGroups()[0]
                .getValueRegex()
                .getLastBestMatch();
            matchedElements.value.push(newValue.match);
            timerId = setTimeout(tick, 1000);
        }, 1000);
    } else {
        clearTimeout(timerId);
        log.value += 'end timer';
    }
});
</script>

<style lang="scss" scoped>
.log-output-container {
    max-height: 400px;
    overflow-y: auto;
}
</style>
