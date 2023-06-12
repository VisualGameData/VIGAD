<template>
    <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        :style="{
            ...{ 'z-index': 800 },
        }"
        persistent
        scrim="#000000"
        width="700px"
        no-click-animation
    >
        <template #activator="{ props }">
            <v-btn v-bind="props" prepend-icon="mdi-cog">
                Session Settings
            </v-btn>
        </template>
        <v-card :loading="isSessionActive">
            <v-toolbar color="primary">
                <v-btn variant="tonal" icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>

                <v-toolbar-title>Session Settings</v-toolbar-title>

                <v-spacer />

                <v-btn
                    v-if="!isSessionActive"
                    :disabled="!isAccessTokenValid"
                    class="rounded-pill"
                    prepend-icon="mdi-play"
                    variant="tonal"
                    @click="startSession()"
                    >Start Session</v-btn
                >

                <v-btn
                    v-else
                    :disabled="!isAccessTokenValid"
                    class="rounded-pill"
                    prepend-icon="mdi-stop"
                    variant="tonal"
                    @click="stopSession()"
                    >Stop Session</v-btn
                >
            </v-toolbar>

            <!-- Access Token -->
            <v-list lines="one">
                <v-list-subheader>WebAPI Access Token</v-list-subheader>
                <v-list-item>
                    <v-list-item-title>
                        <v-text-field
                            v-model="sessionToken"
                            style="width: 450px"
                            class="pt-2"
                            variant="outlined"
                            label="Access Token"
                            name="apiAccessToken"
                            :append-inner-icon="
                                tokenVisibility
                                    ? 'mdi-eye-outline'
                                    : 'mdi-eye-off-outline'
                            "
                            :type="tokenVisibility ? 'text' : 'password'"
                            :error-messages="errorMessage"
                            persistent-placeholder
                            @click:append-inner="toggleTokenVisibility()"
                        >
                            <template #append>
                                <v-tooltip location="bottom">
                                    <template #activator="{ props }">
                                        <v-icon
                                            v-bind="props"
                                            icon="mdi-content-copy"
                                            @click="
                                                copyToClipboard(sessionToken)
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
                                    Generate new token
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-list-item-title>
                </v-list-item>
            </v-list>

            <v-divider />

            <!-- Switches for data -->
            <v-list lines="two">
                <v-list-subheader>Share</v-list-subheader>
                <v-list-item
                    class="pb-0 pt-0"
                    title="Captured Data"
                    subtitle="The server will have access to the streamed data"
                >
                    <template #prepend>
                        <v-switch
                            v-model="streamData"
                            class="mr-4"
                            color="primary"
                            inset
                        ></v-switch>
                    </template>
                </v-list-item>

                <v-list-item
                    class="pb-0 pt-0"
                    title="Regex & Capture Area Settings"
                    subtitle="The server will have access to the regex and capture area settings"
                >
                    <template #prepend>
                        <v-switch
                            v-model="streamRegexAndCaptureAreaSettings"
                            class="mr-4"
                            color="primary"
                            inset
                            :disabled="true"
                        ></v-switch>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
import useClipboard from '@/composables/useClipboard/useClipboard';
import useUploadData from '@/composables/useUploadData/useUploadData';
import useSession from '@/composables/useSession/useSession';

/**
 * Composables
 */
const {
    sessionToken,
    isSessionActive,
    sessionTokenRules,
    startSession,
    stopSession,
    generateSessionToken,
} = useSession();
const { writeClipboardText } = useClipboard();

const { streamData, streamRegexAndCaptureAreaSettings } = useUploadData();

/**
 * Data
 */
const dialog = ref(false);
const isAccessTokenValid = computed(() => {
    return Object.values(sessionTokenRules).every(
        (rule) => rule(sessionToken.value) === true
    );
});
const errorMessage: Ref<string[]> = ref([]);
const tokenVisibility = ref(false);

/**
 * Watch if settings dialog is open and validate token
 */
watch(
    () => dialog.value,
    (value) => {
        if (value) {
            // generate token if empty
            if (sessionToken.value === '') {
                regenerateAccessToken();
                return;
            } else {
                // try to validate token if not empty
                errorMessage.value = Object.values(sessionTokenRules)
                    .map((rule) => rule(sessionToken.value))
                    .filter((value) => typeof value === 'string') as string[];
            }
        } else {
            // reset validation state
            if (!isAccessTokenValid.value) {
                errorMessage.value = Object.values(sessionTokenRules)
                    .map((rule) => rule(sessionToken.value))
                    .filter((value) => typeof value === 'string') as string[];
            }
        }
    }
);

/**
 * Watch for changes in the session token
 */
watch(
    () => sessionToken.value,
    () => {
        validate();
    }
);

/**
 * Watch for access token validity changes
 */
watch(isAccessTokenValid, (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        useNotificationSystem().createSuccessNotification({
            title: 'The session token is valid',
        });
    } else if (oldValue === true && newValue === false) {
        useNotificationSystem().createErrorNotification({
            title: 'The session token is invalid',
        });
    }
});

/**
 * Function which will toggle the visibility of the access token
 */
function toggleTokenVisibility(): void {
    tokenVisibility.value = !tokenVisibility.value;
}

/**
 * Function which will regenerate a new access token
 */
function regenerateAccessToken(): void {
    generateSessionToken();
}

/**
 * Function which will validate the access token and notifies the user
 */
function validate(): void {
    errorMessage.value = Object.values(sessionTokenRules)
        .map((rule) => rule(sessionToken.value))
        .filter((value) => typeof value === 'string') as string[];

    if (!isAccessTokenValid.value && isSessionActive.value) {
        stopSession();
    }
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
</script>

<style lang="scss" scoped>
// Dialog Animation for Settings
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.2s ease-in-out;
}
</style>
