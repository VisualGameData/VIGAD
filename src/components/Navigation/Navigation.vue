<template>
    <v-bottom-navigation :elevation="24" bg-color="surface" grow>
        <v-btn
            :disabled="isRunning"
            to="/capture"
            prepend-icon="mdi-play"
            value="run"
        >
            Capturing
        </v-btn>

        <v-btn
            :disabled="isRunning"
            to="/"
            prepend-icon="mdi-monitor"
            value="source"
        >
            Source
        </v-btn>

        <v-btn
            :disabled="isRunning"
            to="/regex"
            prepend-icon="mdi-regex"
            value="regex"
        >
            Regex
        </v-btn>

        <SettingsPrompt />
        <!-- <v-dialog
            v-model="dialog"
            transition="dialog-bottom-transition"
            :style="{
                ...{ 'z-index': 800 },
            }"
            persistent
            scrim="#000000"
            width="700px"
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
                                                @click="copyToClipboard"
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
        </v-dialog> -->
    </v-bottom-navigation>
</template>

<script setup lang="ts">
import { isRunning } from '@/composables/useRunning';
import SettingsPrompt from '@/components/SettingsPrompt/SettingsPrompt.vue';
// import useNotifications from '@/composables/useNotificationSystem';
// import { onMounted, ref } from 'vue';

// onMounted(() => {
//     // generate a new access token on application start and validate it
//     regenerateAccessToken();
// });

// const isAccessTokenValid = ref(false);
// const tokenVisibility = ref(false);
// const isSessionActive = ref(false);
// const streamData = ref(false);
// const streamRegexAndCaptureAreaSettings = ref(false);

// // Dialog for settings
// const dialog = ref(false);

// /**
//  * Access token
//  */
// const accessToken = ref('');

// /**
//  * Rules for the access token
//  */
// const rules = {
//     required: (value: string) =>
//         !!value || 'An access token is required to start a session',
//     min: (v: string) => v.length >= 8 || 'Min 8 characters',
//     uppercase: (v: string) =>
//         /[A-Z]/.test(v) || 'Must include at least one uppercase letter',
//     lowercase: (v: string) =>
//         /[a-z]/.test(v) || 'Must include at least one lowercase letter',
//     special: (v: string) =>
//         /[\W_]/.test(v) || 'Must include at least one special character',
//     number: (v: string) => /\d/.test(v) || 'Must include at least one number',
// };

// /**
//  * Start the session
//  */
// function startSession() {
//     isSessionActive.value = true;
//     // TODO: Start session functionality
//     useNotifications().createNotification({
//         title: 'Session started',
//     });
// }

// /**
//  * Stop the session
//  */
// function stopSession() {
//     isSessionActive.value = false;
//     // TODO: Stop session functionality
//     useNotifications().createNotification({
//         title: 'Session stopped',
//         type: 'info',
//     });
// }

// /**
//  * Function which will toggle the visibility of the access token
//  */
// function toggleTokenVisibility() {
//     tokenVisibility.value = !tokenVisibility.value;
// }

// /**
//  * Function which will copy the access token to the clipboard
//  */
// async function copyToClipboard() {
//     try {
//         await navigator.clipboard.writeText(accessToken.value);
//         useNotifications().createSuccessNotification({
//             title: 'Copied access token to clipboard',
//         });
//     } catch (err) {
//         useNotifications().createErrorNotification({
//             title: 'Unable to copy access token to clipboard',
//         });
//     }
// }

// /**
//  * Function which will generate a random token
//  */
// function generateRandomToken(): string {
//     const buffer = new Uint8Array(32);
//     crypto.getRandomValues(buffer);
//     const characterSet =
//         'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=?';
//     const token = Array.from(buffer)
//         .map((x: number) => characterSet[x % characterSet.length])
//         .join('');
//     if (
//         rules.lowercase(token) === true &&
//         rules.uppercase(token) === true &&
//         rules.special(token) === true &&
//         rules.number(token) === true &&
//         rules.min(token) === true
//     ) {
//         return token;
//     } else {
//         return generateRandomToken();
//     }
// }

// /**
//  * Function which will regenerate a new access token
//  */
// async function regenerateAccessToken() {
//     // TODO: Regenerate access token functionality
//     accessToken.value = await generateRandomToken();
//     if (!validateAccessToken()) {
//         regenerateAccessToken();
//     }
// }
// function validateAccessToken() {
//     const isValid = Object.values(rules).every(
//         (rule) => rule(accessToken.value) === true
//     );

//     if (isAccessTokenValid.value === isValid) {
//         return isValid;
//     }

//     isAccessTokenValid.value = isValid;

//     if (!isValid && isSessionActive.value) {
//         stopSession();
//         useNotifications().createErrorNotification({
//             title: 'Session stopped',
//             message: 'The access token is invalid',
//         });
//     } else if (!isValid) {
//         useNotifications().createErrorNotification({
//             title: 'The access token is invalid',
//         });
//     } else {
//         useNotifications().createSuccessNotification({
//             title: 'The access token is valid',
//         });
//     }

//     return isValid;
// }
</script>

<style lang="scss" scoped>
// Dialog Animation for Settings
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.2s ease-in-out;
}
</style>
