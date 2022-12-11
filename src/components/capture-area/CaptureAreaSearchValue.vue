<template>
    <div>
        <div class="pt-2 regex-definition">
            <RegexInput
                inputLabel="Search value"
                inputPlaceholder="Enter search value"
                prepend-icon="mdi-table-column"
                matchingOption="Exact"
                slicingOption="Substrings"
                similarityOption="None"
            />
        </div>

        <div class="mt-4 regex-constraint-before-definition">
            <RegexInput
                inputLabel="Before Constraint"
                inputPlaceholder="Enter a constraint"
                prepend-icon="mdi-table-column-plus-before"
                matchingOption="Approximate"
                slicingOption="Substrings"
                similarityOption="None"
            />
        </div>

        <div class="mt-4 regex-constraint-after-definition">
            <RegexInput
                inputLabel="After Constraint"
                inputPlaceholder="Enter a constraint"
                prepend-icon="mdi-table-column-plus-after"
                matchingOption="Approximate"
                slicingOption="Substrings"
                similarityOption="None"
            />
        </div>

        <div class="mt-4 actions">
            <v-btn
                class="rounded-pill"
                color="error"
                prepend-icon="mdi-delete"
                rounded="lg"
                >Delete</v-btn
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import RegexInput from './RegexInput.vue';
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: space-between;
}
</style>
