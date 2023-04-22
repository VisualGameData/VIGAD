<template>
    <v-text-field
        v-model="valueRegex"
        :label="label"
        :placeholder="placeholder"
        variant="outlined"
        hide-details="auto"
    >
        <template v-slot:prepend-inner>
            <v-icon :icon="prependIcon"></v-icon>
        </template>
        <template v-slot:append-inner>
            <v-fade-transition leave-absolute>
                <v-progress-circular
                    v-if="false"
                    color="info"
                    indeterminate
                    size="24"
                ></v-progress-circular>
            </v-fade-transition>
        </template>
    </v-text-field>

    <v-btn
        @click="expand = !expand"
        class="rounded"
        size="x-small"
        variant="text"
    >
        {{ !expand ? 'More Options' : 'Less Options' }}
    </v-btn>

    <v-expand-transition>
        <div v-if="expand" class="pa-4">
            <v-select
                v-model="currentMatchingOption"
                :items="matchingOptions"
                label="Matching"
                variant="underlined"
            ></v-select>

            <v-select
                v-model="currentSlicingOption"
                :items="slicingOptions"
                label="Slicing"
                variant="underlined"
            ></v-select>

            <v-select
                v-model="currentSimilarityOption"
                :items="similarityOptions"
                label="Similarity"
                variant="underlined"
            ></v-select>

            <v-text-field
                v-if="currentMatchingOption === 'Approximate'"
                v-model="currentNumberOfMatches"
                label="Number of Matches"
                placeholder="Enter a number"
                variant="outlined"
                :rules="[(v:number) => !!Number(v) || 'Please enter a number']"
                hide-details="auto"
            >
                <template v-slot:prepend-inner>
                    <v-icon icon="mdi-numeric"></v-icon>
                </template>
            </v-text-field>

            <v-btn
                @click="reset()"
                class="rounded mt-2 mb-2"
                size="small"
                variant="text"
                color="primary"
                width="100%"
            >
                Reset options
            </v-btn>
            <v-divider></v-divider>
        </div>
    </v-expand-transition>
</template>

<script setup lang="ts">
// - [ ] Better Comments

import { ref, watch } from 'vue';
import { Vigad } from '@/proc/Vigad';
import { Matching } from '@/proc/regex/Regex';
import { Slicing } from '@/proc/regex/Regex';
import { Similarity } from '@/proc/regex/Regex';
import { ConstraintRegex } from '@/proc/regex/ConstraintRegex';
import { ValueRegex } from '@/proc/regex/ValueRegex';
import { ResetSettings } from '../CaptureAreaSearchValue/ResetSettings';

const props = defineProps<{
    label: string;
    placeholder: string;
    captureAreaId: number;
    prependIcon: string;
    regex: ConstraintRegex | ValueRegex;
    resetOptions: ResetSettings;
}>();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

const expand = ref(false);

// Value Regex input
const valueRegex = ref(props.regex.getRegex().toString().slice(1, -1));

watch(valueRegex, (newValue) => {
    props.regex.setRegex(newValue.toString());
});

// Matching options
const currentMatchingOption = ref(props.regex.getMatching());

const matchingOptions = ref([Matching.APPROX, Matching.EXACT]);

watch(currentMatchingOption, (newValue) => {
    props.regex.setMatching(newValue);
});

// Slicing options
const currentSlicingOption = ref(props.regex.getSlicing());

const slicingOptions = ref([
    Slicing.SUBSTR,
    Slicing.SPACES,
    Slicing.ENTIRE_STR,
]);

watch(currentSlicingOption, (newValue) => {
    props.regex.setSlicing(newValue);
});

// Similarity options
const currentSimilarityOption = ref(props.regex.getSimilarity());

const similarityOptions = ref([
    Similarity.NONE,
    Similarity.NUM_LET,
    Similarity.LET_NUM,
]);

watch(currentSimilarityOption, (newValue) => {
    props.regex.setSimilarity(newValue);
});

// Number of matches
const currentNumberOfMatches = ref(props.regex.getMatchesNum());

watch(currentNumberOfMatches, (newValue) => {
    if (!Number(newValue)) return;

    props.regex.setMatchesNum(newValue);
});

// Reset all options to default
function reset() {
    currentMatchingOption.value = props.resetOptions.matchingOption;
    currentSlicingOption.value = props.resetOptions.slicingOption;
    currentSimilarityOption.value = props.resetOptions.similarityOption;
    currentNumberOfMatches.value = props.resetOptions.numberOfMatches;
}
</script>

<style lang="scss" scoped></style>
