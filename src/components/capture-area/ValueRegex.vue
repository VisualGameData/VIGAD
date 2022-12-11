<template>
    <v-text-field
        v-model="valueRegex"
        label="Search value"
        placeholder="Enter search value"
        variant="outlined"
        clear-icon="mdi-close-circle"
        :rules="[(v:string) => !!v || 'Regular expression is required']"
        hide-details="auto"
    >
        <template v-slot:prepend-inner>
            <v-icon icon="mdi-table-column"></v-icon>
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
            <v-combobox
                v-model="currentMatchingOption"
                label="Matching"
                :items="matchingOptions"
                variant="underlined"
            ></v-combobox>

            <v-combobox
                v-model="currentSlicingOption"
                label="Slicing"
                :items="slicingOptions"
                variant="underlined"
            ></v-combobox>

            <v-combobox
                v-model="currentSimilarityOption"
                label="Similarity"
                :items="similarityOptions"
                variant="underlined"
            ></v-combobox>

            <v-text-field
                v-if="currentMatchingOption === 'Approximate'"
                v-model="currentNumberOfMatches"
                label="Number of Matches"
                placeholder="Enter a number"
                variant="outlined"
                clear-icon="mdi-close-circle"
                :rules="[(v:number) => !!v || 'Please enter a number']"
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
import { ref, watch } from 'vue';
import { Vigad } from '@/proc/Vigad';

// Later on we will use proper enums for these options
const props = defineProps<{
    captureAreaId: number;
}>();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

const expand = ref(false);

const valueRegex = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .getRegex()
);
watch(valueRegex, (newValue) => {
    console.log(newValue);
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .setRegex(newValue);
});

const defaultMatchingOption = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .getMatching()
);
const currentMatchingOption = ref(defaultMatchingOption.value);
const matchingOptions = ref(['Approximate', 'Exact']);

watch(currentMatchingOption, (newValue) => {
    // TODO: update capture area properties with new value
    console.log(newValue);
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .setMatching(newValue);
});

const defaultSlicingOptions = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .getSlicing()
);
const currentSlicingOption = ref(defaultSlicingOptions.value);
const slicingOptions = ref(['Substrings', 'Spaces', 'Entire string']);

watch(currentSlicingOption, (newValue) => {
    // TODO: update capture area properties with new value
    console.log(newValue);
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .setSlicing(newValue);
});

const defaultSimilarityOptions = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .getSimilarity()
);
const currentSimilarityOption = ref(defaultSimilarityOptions.value);
const similarityOptions = ref(['None', 'Number to Letter', 'Letter to Number']);

watch(currentSimilarityOption, (newValue) => {
    // TODO: update capture area properties with new value
    console.log(newValue);
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .setSimilarity(newValue);
});

const defaultNumberOfMatches = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .getMatchesNum()
);
const currentNumberOfMatches = ref(defaultNumberOfMatches.value);

watch(currentNumberOfMatches, (newValue) => {
    // TODO: update capture area properties with new value
    console.log(newValue);
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getValueRegex()
        .setMatchesNum(newValue);
});

function reset() {
    currentMatchingOption.value = defaultMatchingOption.value;
    currentSlicingOption.value = defaultSlicingOptions.value;
    currentSimilarityOption.value = defaultSimilarityOptions.value;
    currentNumberOfMatches.value = defaultNumberOfMatches.value;
}
</script>

<style lang="scss" scoped></style>
