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
        <template v-slot:activator="{ props }">
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
                            v-model="accessToken"
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
                            :rules="[
                                rules.uppercase,
                                rules.lowercase,
                                rules.min,
                                rules.required,
                                rules.special,
                                rules.number,
                            ]"
                            :error="!validateAccessToken()"
                            :error-messages="errorMessage"
                            @click:append-inner="toggleTokenVisibility()"
                            @update:model-value="validateAccessToken()"
                            persistent-placeholder
                        >
                            <template v-slot:append>
                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon
                                            v-bind="props"
                                            icon="mdi-content-copy"
                                            @click="
                                                copyToClipboard(accessToken)
                                            "
                                        ></v-icon>
                                    </template>

                                    Copy to clipboard
                                </v-tooltip>
                            </template>
                            <template v-slot:prepend>
                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-icon
                                            v-bind="props"
                                            icon="mdi-refresh"
                                            @click="regenerateAccessToken"
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
                    <template v-slot:prepend>
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
                    <template v-slot:prepend>
                        <v-switch
                            v-model="streamRegexAndCaptureAreaSettings"
                            class="mr-4"
                            color="primary"
                            inset
                        ></v-switch>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
import useClipboard from '@/composables/useClipboard/useClipboard';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';
import { Ref, onMounted, ref, watch } from 'vue';

onMounted(() => {});

/**
 * Composables
 */
const { writeClipboardText } = useClipboard();
const { rules, generateToken } = useTokenGenerator();

/**
 * Data
 */
const isAccessTokenValid = ref(false);
const errorMessage: Ref<string[]> = ref([]);
const tokenVisibility = ref(false);
const isSessionActive = ref(false);
const streamData = ref(false);
const streamRegexAndCaptureAreaSettings = ref(false);

/**
 * Dialog visibility
 */
const dialog = ref(false);
watch(
    () => dialog.value,
    (value) => {
        if (value) {
            // generate token if empty
            if (accessToken.value === '') regenerateAccessToken();
        } else {
            // reset validation state
            const isValid = Object.values(rules).every(
                (rule) => rule(accessToken.value) === true
            );

            if (isAccessTokenValid.value === isValid) {
                errorMessage.value = Object.values(rules)
                    .map((rule) => rule(accessToken.value))
                    .filter((value) => typeof value === 'string') as string[];
            }
        }
    }
);

/**
 * Access token
 */
const accessToken = ref('');

/**
 * Start the session
 */
function startSession() {
    isSessionActive.value = true;
    // TODO: Start session functionality
    useNotificationSystem().createNotification({
        title: 'Session started',
    });
}

/**
 * Stop the session
 */
function stopSession() {
    isSessionActive.value = false;
    // TODO: Stop session functionality
    useNotificationSystem().createNotification({
        title: 'Session stopped',
        type: 'info',
    });
}

/**
 * Function which will toggle the visibility of the access token
 */
function toggleTokenVisibility() {
    tokenVisibility.value = !tokenVisibility.value;
}

/**
 * Function which will regenerate a new access token
 */
async function regenerateAccessToken() {
    accessToken.value = generateToken();

    if (!validateAccessToken()) {
        regenerateAccessToken();
    }
}

/**
 * Function which will validate the access token and notifies the user
 */
function validateAccessToken() {
    const isValid = Object.values(rules).every(
        (rule) => rule(accessToken.value) === true
    );

    if (isAccessTokenValid.value === isValid) {
        return isValid;
    }

    isAccessTokenValid.value = isValid;

    if (!isValid && isSessionActive.value) {
        stopSession();
        useNotificationSystem().createErrorNotification({
            title: 'Session stopped',
            message: 'The access token is invalid',
        });
    } else if (!isValid) {
        useNotificationSystem().createErrorNotification({
            title: 'The access token is invalid',
        });
    } else {
        useNotificationSystem().createSuccessNotification({
            title: 'The access token is valid',
        });
    }

    return isValid;
}

/**
 * Function which will copy the access token to the clipboard
 */
async function copyToClipboard(text: string) {
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
