<template>
    <div>
        <div class="pt-2">
            <v-text-field
                ref="captureAreaIdInput"
                v-model="captureAreaIdInputValue"
                variant="outlined"
                label="Capture Area ID"
                name="captureAreaId"
                persistent-placeholder
                :error-messages="errorMessage"
                type="text"
                validate-on="input"
                autofocus
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
                @click="deleteCaptureArea(captureAreaId)"
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

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());

/**
 * Rules for the capture area id input
 */
const captureAreaIdRules = {
    required: (value: string) =>
        !!value || 'An access token is required to start a session',
    uppercase: (v: string) =>
        /[A-Z]/.test(v) || 'Must include at least one uppercase letter',
    lowercase: (v: string) =>
        /[a-z]/.test(v) || 'Must include at least one lowercase letter',
    number: (v: string) =>
        /[0-9]+/.test(v) || 'Must include at least one number',
    max: (v: string) =>
        v.length <= 6 || 'Must be less than or equal to 6 characters',
    nospecial: (v: string) =>
        !/[^A-Za-z0-9]/.test(v) || 'Must not include special characters',
};

/**
 * Data
 */
const captureAreaIdInput: Ref<HTMLInputElement | undefined> = ref();
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
 * Watch for capture area id validity changes
 */
watch(isCaptureAreaIdInputValid, (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        useNotificationSystem().createSuccessNotification({
            title: 'The capture area id is valid',
        });
    } else if (oldValue === true && newValue === false) {
        useNotificationSystem().createErrorNotification({
            title: 'The capture area id is invalid',
        });
    }
});

/**
 * Function which will validate the access token and notifies the user
 */
function validate() {
    errorMessage.value = Object.values(captureAreaIdRules)
        .map((rule) => rule(captureAreaIdInputValue.value))
        .filter((value) => typeof value === 'string') as string[];

    if (isCaptureAreaIdInputValid.value && errorMessage.value.length === 0) {
        const isRenamed = vigad.value.renameCaptureArea(
            defProps.captureAreaId,
            captureAreaIdInputValue.value
        );

        if (isRenamed) {
            useNotificationSystem().createSuccessNotification({
                title: 'Capture area id has been renamed',
            });
        } else {
            useNotificationSystem().createErrorNotification({
                title: 'Failed to rename capture area id',
            });
        }
    }
}

/**
 * Function which will regenerate a new access token
 */
function regenerateAccessToken(): void {
    captureAreaIdInputValue.value = vigad.value.generateCaptureAreaId();
}

/**
 * Function which will copy the access token to the clipboard
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
 * Gives a notficiation after deletion of capture area
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
