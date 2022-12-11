<template>
    <div>
        <div class="pt-2 regex-definition">
            <ValueRegex />
        </div>

        <div class="mt-4 regex-constraint-before-definition">
            <BeforeConstraintRegexVue />
        </div>

        <div class="mt-4 regex-constraint-after-definition">
            <AfterConstraintRegexVue />
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
import ValueRegex from './ValueRegex.vue';
import BeforeConstraintRegexVue from './BeforeConstraintRegex.vue';
import AfterConstraintRegexVue from './AfterConstraintRegex.vue';
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: space-between;
}
</style>
