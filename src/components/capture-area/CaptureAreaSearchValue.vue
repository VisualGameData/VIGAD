<template>
    <div>
        <div class="pt-2 regex-definition">
            <!-- TODO: fetch from capture area die jeweiligen properties und nutz die dann hier drin sogesehen -->
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
import { onMounted, ref } from 'vue';
import ValueRegex from './ValueRegex.vue';
import RegexInput from './RegexInput.vue';
import { Vigad } from '@/proc/Vigad';

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

// Mit dieser captureAreaId referenz sollte es möglich sein das man die jeweiligen properties aus der capture area holen kann und diese dann in den input feldern anzeigen kann als auch die änderungen in den input feldern in die capture area schreiben kann
const props = defineProps<{
    captureAreaId: number;
}>();

onMounted(() => {
    console.log(
        'Value Regex',
        vigad.value
            .getCaptureArea(props.captureAreaId)
            .getRegexGroups()[0]
            .getValueRegex()
    );

    // console.log(
    //     'Before',
    //     vigad.value
    //         .getCaptureArea(props.captureAreaId)
    //         .getRegexGroups()[0]
    //         .getConstraintRegex()[0]
    // );

    // console.log(
    //     'After',
    //     vigad.value
    //         .getCaptureArea(props.captureAreaId)
    //         .getRegexGroups()[0]
    //         .getConstraintRegex()[1]
    // );
});
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: space-between;
}
</style>
