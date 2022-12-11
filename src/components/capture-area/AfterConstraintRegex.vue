<template>
    <v-text-field
        label="After Constraint"
        placeholder="Enter a constraint"
        variant="outlined"
        clear-icon="mdi-close-circle"
        :rules="[(v:string) => !!v || 'Regular expression is required']"
        hide-details="auto"
    >
        <template v-slot:prepend-inner>
            <v-icon icon="mdi-table-column-plus-after"></v-icon>
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
import { ref } from 'vue';

const expand = ref(false);

const location = ref('After');

const defaultMatchingOption = ref('Approximate');
const currentMatchingOption = ref(defaultMatchingOption.value);
const matchingOptions = ref(['Approximate', 'Exact']);

const defaultSlicingOptions = ref('At spaces');
const currentSlicingOption = ref(defaultSlicingOptions.value);
const slicingOptions = ref(['Spaces', 'Substrings', 'Entire string']);

const defaultSimilarityOptions = ref('Letter to Number');
const currentSimilarityOption = ref(defaultSimilarityOptions.value);
const similarityOptions = ref(['None', 'Number to Letter', 'Letter to Number']);

const defaultNumberOfMatches = ref(10000);
const currentNumberOfMatches = ref(defaultNumberOfMatches.value);

function reset() {
    currentMatchingOption.value = defaultMatchingOption.value;
    currentSlicingOption.value = defaultSlicingOptions.value;
    currentSimilarityOption.value = defaultSimilarityOptions.value;
    currentNumberOfMatches.value = defaultNumberOfMatches.value;
}
</script>

<style lang="scss" scoped></style>
