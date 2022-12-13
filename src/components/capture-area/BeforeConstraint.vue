<template>
    <v-text-field
        v-model="beforeValueConstraint"
        label="Before Constraint"
        placeholder="Enter a constraint value"
        variant="outlined"
        hide-details="auto"
    >
        <template v-slot:prepend-inner>
            <v-icon icon="mdi-table-column-plus-before"></v-icon>
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
import { ref, watch } from 'vue';
import { Vigad } from '@/proc/Vigad';
import { Matching } from '@/proc/regex/Regex';
import { Slicing } from '@/proc/regex/Regex';
import { Similarity } from '@/proc/regex/Regex';

const props = defineProps<{
    captureAreaId: number;
}>();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

const expand = ref(false);

// Value Regex input
const beforeValueConstraint = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .getRegex()
        .toString()
        .slice(1, -1)
);

watch(beforeValueConstraint, (newValue) => {
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .setRegex(newValue.toString());
});

// Matching options
const currentMatchingOption = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .getMatching()
);

const matchingOptions = ref([Matching.APPROX, Matching.EXACT]);

watch(currentMatchingOption, (newValue) => {
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .setMatching(newValue);
});

// Slicing options
const currentSlicingOption = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .getSlicing()
);

const slicingOptions = ref([
    Slicing.SUBSTR,
    Slicing.SPACES,
    Slicing.ENTIRE_STR,
]);

watch(currentSlicingOption, (newValue) => {
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .setSlicing(newValue);
});

// Similarity options
const currentSimilarityOption = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .getSimilarity()
);

const similarityOptions = ref([
    Similarity.NONE,
    Similarity.NUM_LET,
    Similarity.LET_NUM,
]);

watch(currentSimilarityOption, (newValue) => {
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .setSimilarity(newValue);
});

// Number of matches
const currentNumberOfMatches = ref(
    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .getMatchesNum()
);

watch(currentNumberOfMatches, (newValue) => {
    if (!Number(newValue)) return;

    vigad.value
        .getCaptureArea(props.captureAreaId)
        .getRegexGroups()[0]
        .getConstraintRegex()[0]
        .setMatchesNum(newValue);
});

// Reset all options to default
function reset() {
    currentMatchingOption.value = Matching.APPROX;
    currentSlicingOption.value = Slicing.SUBSTR;
    currentSimilarityOption.value = Similarity.NONE;
    currentNumberOfMatches.value = 10000;
}
</script>

<style lang="scss" scoped></style>
