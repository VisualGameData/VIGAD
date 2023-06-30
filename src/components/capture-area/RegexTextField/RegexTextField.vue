<template>
    <v-text-field
        v-model="valueRegex"
        :label="label"
        :placeholder="placeholder"
        :error="!isRegexValid"
        :rules="[(v:string) => isRegexValid || errorMessage]"
        variant="outlined"
        hide-details="auto"
    >
        <template #prepend-inner>
            <v-icon :icon="prependIcon"></v-icon>
        </template>
        <template #append-inner>
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
        class="rounded"
        size="x-small"
        variant="text"
        @click="expand = !expand"
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
                <template #prepend-inner>
                    <v-icon icon="mdi-numeric"></v-icon>
                </template>
            </v-text-field>

            <v-btn
                class="rounded mt-2 mb-2"
                size="small"
                variant="text"
                color="primary"
                width="100%"
                @click="reset()"
            >
                Reset options
            </v-btn>
            <v-divider></v-divider>
        </div>
    </v-expand-transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Matching } from '@/proc/regex/Regex';
import { Slicing } from '@/proc/regex/Regex';
import { Similarity } from '@/proc/regex/Regex';
import { ConstraintRegex } from '@/proc/regex/ConstraintRegex';
import { ValueRegex } from '@/proc/regex/ValueRegex';
import { ResetSettings } from '../CaptureAreaSearchValue/ResetSettings';

const props = defineProps<{
    label: string;
    placeholder: string;
    captureAreaId: string;
    prependIcon: string;
    regex: ConstraintRegex | ValueRegex;
    resetOptions: ResetSettings;
}>();

/**
 * @type {Ref<boolean>}
 * @description Ref to the expand state of the more options section
 */
const expand = ref(false);

/**
 * @type {Ref<boolean>}
 * @description Ref to the validity of the regex
 */
const isRegexValid = ref(true);

/**
 * @type {Ref<string>}
 * @description Ref to the error message if the regex is not valid
 */
const errorMessage = computed(() => {
    if (!isRegexValid.value) {
        return "Your Regex is not valid and can't be processed!";
    } else {
        return '';
    }
});

/**
 * @type {Ref<string>}
 * @description Ref to the value of the regex input
 */
const valueRegex = ref(props.regex.getRegex().toString().slice(1, -1));

/**
 * @description watches the valueRegex and updates the regex if it is a valid regex
 */
watch(valueRegex, (newValue) => {
    try {
        // try to create a new regex with the new value to check if it is valid
        new RegExp(newValue.toString());
        props.regex.setRegex(newValue.toString());
        isRegexValid.value = true;
    } catch (e) {
        // if the regex is not valid notify the user
        isRegexValid.value = false;
    }
});

/**
 * @type {Ref<Matching>}
 * @description Ref to the current matching option
 */
const currentMatchingOption = ref(props.regex.getMatching());

/**
 * @type {Ref<Matching[]>}
 * @description Ref to all of the matching options
 */
const matchingOptions = ref([Matching.APPROX, Matching.EXACT]);

/**
 * @description watches the current matching option and updates the regex
 */
watch(currentMatchingOption, (newValue) => {
    props.regex.setMatching(newValue);
});

/**
 * @type {Ref<Slicing>}
 * @description Ref to the current slicing option
 */
const currentSlicingOption = ref(props.regex.getSlicing());

/**
 * @type {Ref<Slicing[]>}
 * @description Ref to all of the slicing options
 */
const slicingOptions = ref([
    Slicing.SUBSTR,
    Slicing.SPACES,
    Slicing.ENTIRE_STR,
]);

/**
 * @description watches the current slicing option and updates the regex
 */
watch(currentSlicingOption, (newValue) => {
    props.regex.setSlicing(newValue);
});

/**
 * @type {Ref<Similarity>}
 * @description Ref to the current similarity option
 */
const currentSimilarityOption = ref(props.regex.getSimilarity());

/**
 * @type {Ref<Similarity[]>}
 * @description Ref to all of the similarity options
 */
const similarityOptions = ref([
    Similarity.NONE,
    Similarity.NUM_LET,
    Similarity.LET_NUM,
]);

/**
 * @description watches the current similarity option and updates the regex
 */
watch(currentSimilarityOption, (newValue) => {
    props.regex.setSimilarity(newValue);
});

/**
 * @type {Ref<number>}
 * @description Ref to the current number of matches
 */
const currentNumberOfMatches = ref(props.regex.getMatchesNum());

/**
 * @description watches the current number of matches and updates the regex
 */
watch(currentNumberOfMatches, (newValue) => {
    if (!Number(newValue)) return;

    props.regex.setMatchesNum(newValue);
});

/**
 * @description Reset all options to default
 * @returns {void}
 */
function reset() {
    currentMatchingOption.value = props.resetOptions.matchingOption;
    currentSlicingOption.value = props.resetOptions.slicingOption;
    currentSimilarityOption.value = props.resetOptions.similarityOption;
    currentNumberOfMatches.value = props.resetOptions.numberOfMatches;
}
</script>

<style lang="scss" scoped></style>
