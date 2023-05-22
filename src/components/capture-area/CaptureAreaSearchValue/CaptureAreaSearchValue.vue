<template>
    <div>
        <div class="pt-2 regex-definition">
            <RegexTextField
                label="Search value"
                placeholder="Enter search value"
                prepend-icon="mdi-table-column"
                :captureAreaId="captureAreaId"
                :regex="valueRegex"
                :resetOptions="defaultValueRegexSettings"
            />
        </div>

        <div class="mt-4 regex-constraint-before-definition">
            <RegexTextField
                label="Before Constraint"
                placeholder="Enter a constraint value"
                prepend-icon="mdi-table-column-plus-before"
                :captureAreaId="captureAreaId"
                :regex="beforeConstraint"
                :resetOptions="defaultBeforeConstraintsSettings"
            />
        </div>

        <div class="mt-4 regex-constraint-after-definition">
            <RegexTextField
                label="After Constraint"
                placeholder="Enter a constraint value"
                prepend-icon="mdi-table-column-plus-after"
                :captureAreaId="captureAreaId"
                :regex="afterConstraint"
                :resetOptions="defaultAfterConstraintsSettings"
            />
        </div>

        <div class="mt-4 actions">
            <v-btn
                class="rounded-pill"
                color="error"
                prepend-icon="mdi-delete"
                rounded="lg"
                @click="deleteCaptureAreaNotification(captureAreaId)"
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
function deleteCaptureAreaNotification(id: number): void{
    useNotificationSystem().createWarningNotification({
            title: 'Capture Area Deleted',
            message: 'The Capture Area ' + id + ' got deleted '
    });
    vigad.value.deleteCaptureArea(id);
    
}

</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: space-between;
}
</style>
