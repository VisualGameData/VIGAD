<template>
    <div>
        <div class="pt-2 regex-definition">
            <ValueRegex :captureAreaId="captureAreaId" />

            <!-- <RegexInput
                inputLabel="Search value"
                inputPlaceholder="Enter search value"
                prepend-icon="mdi-table-column"
                matchingOption="Exact"
                slicingOption="Substrings"
                similarityOption="None"
            /> -->
        </div>

        <div class="mt-4 regex-constraint-before-definition">
            <BeforeConstraint :captureAreaId="captureAreaId" />
            <!-- <RegexInput
                inputLabel="Before Constraint"
                inputPlaceholder="Enter a constraint"
                prepend-icon="mdi-table-column-plus-before"
                matchingOption="Approximate"
                slicingOption="Substrings"
                similarityOption="None"
            /> -->
        </div>

        <div class="mt-4 regex-constraint-after-definition">
            <AfterConstraint :captureAreaId="captureAreaId" />
            <!-- <RegexInput
                inputLabel="After Constraint"
                inputPlaceholder="Enter a constraint"
                prepend-icon="mdi-table-column-plus-after"
                matchingOption="Approximate"
                slicingOption="Substrings"
                similarityOption="None"
            /> -->
        </div>

        <div class="mt-4 actions">
            <v-btn
                class="rounded-pill"
                color="error"
                prepend-icon="mdi-delete"
                rounded="lg"
                @click="vigad.deleteCaptureArea(captureAreaId)"
                >Delete</v-btn
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Vigad } from '@/proc/Vigad';
import ValueRegex from './ValueRegex.vue';
import BeforeConstraint from './BeforeConstraint.vue';
import AfterConstraint from './AfterConstraint.vue';
import RegexInput from './RegexInput.vue';

const props = defineProps<{
    captureAreaId: number;
}>();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

onMounted(() => {
    console.log(
        'Value Regex',
        vigad.value
            .getCaptureArea(props.captureAreaId)
            .getRegexGroups()[0]
            .getValueRegex()
    );

    console.log(
        'Before',
        vigad.value
            .getCaptureArea(props.captureAreaId)
            .getRegexGroups()[0]
            .getConstraintRegex()[0]
    );

    console.log(
        'After',
        vigad.value
            .getCaptureArea(props.captureAreaId)
            .getRegexGroups()[0]
            .getConstraintRegex()[1]
    );
});
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: space-between;
}
</style>
