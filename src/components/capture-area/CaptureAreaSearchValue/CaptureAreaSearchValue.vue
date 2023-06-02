<template>
    <div>
        <div class="pt-2 regex-definition">
            <RegexTextField
                label="Search value"
                placeholder="Enter search value"
                prepend-icon="mdi-table-column"
                :capture-area-id="captureAreaId"
                :regex="valueRegex"
                :reset-options="defaultValueRegexSettings"
            />
        </div>

        <div class="mt-4 regex-constraint-before-definition">
            <RegexTextField
                label="Before Constraint"
                placeholder="Enter a constraint value"
                prepend-icon="mdi-table-column-plus-before"
                :capture-area-id="captureAreaId"
                :regex="beforeConstraint"
                :reset-options="defaultBeforeConstraintsSettings"
            />
        </div>

        <div class="mt-4 regex-constraint-after-definition">
            <RegexTextField
                label="After Constraint"
                placeholder="Enter a constraint value"
                prepend-icon="mdi-table-column-plus-after"
                :capture-area-id="captureAreaId"
                :regex="afterConstraint"
                :reset-options="defaultAfterConstraintsSettings"
            />
        </div>

        <div class="mt-4">
            <v-btn
                class="rounded-pill"
                color="error"
                prepend-icon="mdi-delete"
                rounded="lg"
                @click="deleteCaptureArea(captureAreaId)"
                >Delete</v-btn
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Vigad } from '@/proc/Vigad';
import RegexTextField from '@/components/capture-area/RegexTextField/RegexTextField.vue';
import {
    defaultValueRegexSettings,
    defaultAfterConstraintsSettings,
    defaultBeforeConstraintsSettings,
} from './ResetSettings';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

/**
 * Definied Props
 */
const props = defineProps<{
    captureAreaId: number;
}>();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

/**
 * Value regex
 */
const valueRegex = vigad.value
    .getCaptureArea(props.captureAreaId)
    .getRegexGroups()[0]
    .getValueRegex();

/**
 * Before constraint
 */
const beforeConstraint = vigad.value
    .getCaptureArea(props.captureAreaId)
    .getRegexGroups()[0]
    .getConstraintRegex()[0];

/**
 * After constraint
 */
const afterConstraint = vigad.value
    .getCaptureArea(props.captureAreaId)
    .getRegexGroups()[0]
    .getConstraintRegex()[1];

/**
 * Gives a notficiation after deletion of capture area
 * @param captureAreaId
 */
function deleteCaptureArea(id: number): void {
    useNotificationSystem().createWarningNotification({
        title: 'Capture Area Deleted',
        message: 'Reorganizing capture areas...',
    });
    vigad.value.deleteCaptureArea(id);
}
</script>

<style lang="scss" scoped></style>
