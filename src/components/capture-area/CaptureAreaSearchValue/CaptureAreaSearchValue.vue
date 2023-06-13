<template>
    <div>
        <div class="pt-2">
            <v-text-field
                v-model="captureAreaIdInputValue"
                variant="outlined"
                label="Capture Area ID"
                name="captureAreaId"
                type="text"
                :error-messages="errorMessage"
                persistent-placeholder
                @blur="updateIdName()"
                @keyup.enter="updateIdName()"
            >
                <template #append>
                    <v-tooltip location="bottom">
                        <template #activator="{ props }">
                            <v-icon
                                v-bind="props"
                                icon="mdi-content-copy"
                                @click="
                                    copyToClipboard(captureAreaIdInputValue)
                                "
                            ></v-icon>
                        </template>
                        Copy to clipboard
                    </v-tooltip>
                </template>
                <template #prepend>
                    <v-tooltip location="bottom">
                        <template #activator="{ props }">
                            <v-icon
                                v-bind="props"
                                icon="mdi-refresh"
                                @click="regenerateAccessToken()"
                            ></v-icon>
                        </template>
                        Generate new capture area ID
                    </v-tooltip>
                </template>
            </v-text-field>
        </div>

        <div class="mt-4 regex-definition">
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
                @click="deleteCaptureArea(captureAreaIdInputValue)"
                >Delete</v-btn
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { Vigad } from '@/proc/Vigad';
import RegexTextField from '@/components/capture-area/RegexTextField/RegexTextField.vue';
import {
    defaultValueRegexSettings,
    defaultAfterConstraintsSettings,
    defaultBeforeConstraintsSettings,
} from './ResetSettings';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
import useClipboard from '@/composables/useClipboard/useClipboard';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';

/**
 * Definied Props
 */
const defProps = defineProps<{
    captureAreaId: string;
}>();

/**
 * Composables
 */
const { writeClipboardText } = useClipboard();
const {
    requiredRule,
    lowercaseLettersRule,
    uppercaseLettersRule,
    numbersRule,
} = useTokenGenerator();

/**
 * Get singleton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

/**
 * Rules for the capture area ID input
 */
const captureAreaIdRules = {
    required: requiredRule,
    uppercase: uppercaseLettersRule,
    lowercase: lowercaseLettersRule,
    number: numbersRule,
    maxCaIdChars: (v: string) =>
        v.length <= 6 || 'Must be less than or equal to 6 characters',
    nospecial: (v: string) =>
        !/[^A-Za-z0-9]/.test(v) || 'Must not include special characters',
    idDoesNotExistYet: (v: string) =>
        vigad.value.CaptureAreaIdIsUnique(v) ||
        'Capture area ID already exists',
};

/**
 * Data
 */
const captureAreaIdInputValue = ref(defProps.captureAreaId);
const isCaptureAreaIdInputValid = computed(() => {
    return Object.values(captureAreaIdRules).every(
        (rule) => rule(captureAreaIdInputValue.value) === true
    );
});
const errorMessage: Ref<string[]> = ref([]);

/**
 * Value regex
 */
const valueRegex = vigad.value
    .getCaptureArea(defProps.captureAreaId)
    .getRegexGroups()[0]
    .getValueRegex();

/**
 * Before constraint
 */
const beforeConstraint = vigad.value
    .getCaptureArea(defProps.captureAreaId)
    .getRegexGroups()[0]
    .getConstraintRegex()[0];

/**
 * After constraint
 */
const afterConstraint = vigad.value
    .getCaptureArea(defProps.captureAreaId)
    .getRegexGroups()[0]
    .getConstraintRegex()[1];

/**
 * Watch for changes in the access token
 */
watch(
    () => captureAreaIdInputValue.value,
    () => {
        validate();
    }
);

/**
 * Computed property to check if the capture area ID input is invalid
 */
const isCaptureAreaIdInputInvalid = computed(() => {
    return (
        isCaptureAreaIdInputValid.value === false &&
        errorMessage.value.length > 0
    );
});

/**
 * Watch for capture area ID input validity changes
 */
watch(isCaptureAreaIdInputInvalid, (newValue) => {
    if (newValue) {
        useNotificationSystem().createErrorNotification({
            title: 'The capture area ID is invalid',
        });
    }
});

/**
 * Function to validate the access token and notify the user
 */
function validate() {
    errorMessage.value = Object.values(captureAreaIdRules)
        .map((rule) => rule(captureAreaIdInputValue.value))
        .filter((value) => typeof value === 'string') as string[];

    // if (isCaptureAreaIdInputValid.value && errorMessage.value.length === 0) {
    //     const isRenamed = ref(
    //         vigad.value.renameCaptureArea(
    //             defProps.captureAreaId,
    //             captureAreaIdInputValue.value
    //         )
    //     );

    //     if (isRenamed.value) {
    //         useNotificationSystem().createSuccessNotification({
    //             title: 'Capture area ID has been renamed',
    //         });
    //     } else {
    //         useNotificationSystem().createErrorNotification({
    //             title: 'Failed to rename capture area ID',
    //         });
    //     }
    // }
}

function updateIdName() {
    errorMessage.value = Object.values(captureAreaIdRules)
        .map((rule) => rule(captureAreaIdInputValue.value))
        .filter((value) => typeof value === 'string') as string[];

    if (isCaptureAreaIdInputValid.value && errorMessage.value.length === 0) {
        const isRenamed = ref(
            vigad.value.renameCaptureArea(
                defProps.captureAreaId,
                captureAreaIdInputValue.value
            )
        );

        if (isRenamed.value) {
            useNotificationSystem().createSuccessNotification({
                title: 'Capture area ID has been renamed',
            });
        } else {
            useNotificationSystem().createErrorNotification({
                title: 'Failed to rename capture area ID',
            });
        }
    }
}

/**
 * Function to regenerate a new access token
 */
function regenerateAccessToken(): void {
    captureAreaIdInputValue.value = vigad.value.generateCaptureAreaId();
}

/**
 * Function to copy the access token to the clipboard
 */
async function copyToClipboard(text: string): Promise<void> {
    const isSuccessful = await writeClipboardText(text);
    if (isSuccessful) {
        useNotificationSystem().createSuccessNotification({
            title: 'Copied to clipboard',
            message: 'The text has been copied to your clipboard.',
        });
    } else {
        useNotificationSystem().createErrorNotification({
            title: 'Failed to copy access token to clipboard',
        });
    }
}

/**
 * Function to give a notification after deletion of the capture area
 * @param captureAreaId
 */
function deleteCaptureArea(id: string): void {
    useNotificationSystem().createWarningNotification({
        title: 'Reorganizing capture areas...',
        message: 'Cleaning up ...',
    });
    vigad.value.deleteCaptureArea(id);
}
</script>

<style lang="scss" scoped></style>
