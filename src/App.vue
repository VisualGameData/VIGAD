<template>
    <v-app theme="dark">
        <!-- Main Content view-->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <v-row cols="12" no-gutters>
                    <v-col cols="2" md="4" id="side-panel-container">
                        <v-sheet
                            color="background"
                            rounded="lg"
                            class="proper-height"
                        >
                            <router-view />
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="proper-height" rounded="lg">
                            <div id="video-stream-container">
                                <MainVideoStream />
                            </div>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <!-- Bottom Navigation -->
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

            <v-dialog
                v-model="dialog"
                transition="dialog-bottom-transition"
                :style="{
                    ...{ 'z-index': 800 },
                }"
                persistent
                fullscreen
                scrim
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
                                    :type="
                                        tokenVisibility ? 'text' : 'password'
                                    "
                                    :rules="[
                                        rules.uppercase,
                                        rules.lowercase,
                                        rules.min,
                                        rules.required,
                                        rules.special,
                                        rules.number,
                                    ]"
                                    @click:append-inner="
                                        toggleTokenVisibility()
                                    "
                                    @update:model-value="validateAccessToken()"
                                    persistent-placeholder
                                >
                                    <template v-slot:append>
                                        <v-tooltip location="bottom">
                                            <template
                                                v-slot:activator="{ props }"
                                            >
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
                                            <template
                                                v-slot:activator="{ props }"
                                            >
                                                <v-icon
                                                    v-bind="props"
                                                    icon="mdi-refresh"
                                                    @click="
                                                        regenerateAccessToken
                                                    "
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
        </v-bottom-navigation>

        <!-- Notification System -->
        <v-snackbar
            v-for="(notification, index) in notifications"
            v-model="notification.isActive"
            :key="index"
            :timeout="notification.timeout || 3000"
            @update:model-value="dismissNotification(notification, index)"
            :color="notification.color"
            location="top right"
            max-width="300px"
            height="60px"
            :style="{
                ...{ 'margin-top': calcMargin(index) },
                ...{ 'z-index': 900 },
            }"
            :multi-line="false"
        >
            <div class="scrollable-content">
                {{ notification.message }}
            </div>

            <template v-slot:actions>
                <v-btn
                    icon="mdi-close"
                    variant="plain"
                    @click="dismissNotification(notification, index)"
                ></v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isRunning } from '@/composables/useRunning';
import {
    useNotificationSystem,
    Notification,
    notificationQueue,
} from '@/composables/useNotificationSystem';

import MainVideoStream from '@/components/MainVideoStream/MainVideoStream.vue';

// Handle System Bar Functions for later
async function minimizeScreen() {
    await (window as any).electronAPI.minimizeScreen();
}

async function fullScreen() {
    await (window as any).electronAPI.fullScreen();
}

async function closeApplication() {
    await (window as any).electronAPI.closeApplication();
}

// Force the application to navigate to the default route
const router = useRouter();
onMounted(() => {
    // navigate to the default route
    router.push('/');

    // generate a new access token on application start and validate it
    regenerateAccessToken();
});

// Dialog for settings
const dialog = ref(false);

/**
 * Access token
 */
const accessToken = ref('');

/**
 * Rules for the access token
 */
const rules = {
    required: (value: string) =>
        !!value || 'An access token is required to start a session',
    min: (v: string) => v.length >= 8 || 'Min 8 characters',
    uppercase: (v: string) =>
        /[A-Z]/.test(v) || 'Must include at least one uppercase letter',
    lowercase: (v: string) =>
        /[a-z]/.test(v) || 'Must include at least one lowercase letter',
    special: (v: string) =>
        /[\W_]/.test(v) || 'Must include at least one special character',
    number: (v: string) => /\d/.test(v) || 'Must include at least one number',
};

const tokenVisibility = ref(false);
const isSessionActive = ref(false);
const streamData = ref(false);
const streamRegexAndCaptureAreaSettings = ref(false);

/**
 * Start the session
 */
function startSession() {
    isSessionActive.value = true;
    // TODO: Start session functionality
    useNotificationSystem().addNotification({
        message: 'Session Started',
        timeout: 2000,
        color: 'info',
        isActive: true,
    });
}

/**
 * Stop the session
 */
function stopSession() {
    isSessionActive.value = false;
    // TODO: Stop session functionality
    useNotificationSystem().addNotification({
        message: 'Session stopped',
        timeout: 2000,
        color: 'info',
        isActive: true,
    });
}

/**
 * Function which will toggle the visibility of the access token
 */
function toggleTokenVisibility() {
    tokenVisibility.value = !tokenVisibility.value;
}

/**
 * Function which will copy the access token to the clipboard
 */
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(accessToken.value);
        useNotificationSystem().addNotification({
            message: 'Copied access token to clipboard',
            timeout: 2000,
            color: 'info',
            isActive: true,
        });
    } catch (err) {
        useNotificationSystem().addNotification({
            message: 'Unable to copy access token to clipboard',
            timeout: 3000,
            color: 'error',
            isActive: true,
        });
    }
}

/**
 * Function which will generate a random token
 */
function generateRandomToken(): string {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    const characterSet =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=?';
    const token = Array.from(buffer)
        .map((x: number) => characterSet[x % characterSet.length])
        .join('');
    if (
        rules.lowercase(token) === true &&
        rules.uppercase(token) === true &&
        rules.special(token) === true &&
        rules.number(token) === true &&
        rules.min(token) === true
    ) {
        return token;
    } else {
        return generateRandomToken();
    }
}

/**
 * Function which will regenerate a new access token
 */
async function regenerateAccessToken() {
    // TODO: Regenerate access token functionality
    accessToken.value = await generateRandomToken();
    if (!validateAccessToken()) {
        regenerateAccessToken();
    }
}
const isAccessTokenValid = ref(false);

function validateAccessToken() {
    const isValid = Object.values(rules).every(
        (rule) => rule(accessToken.value) === true
    );

    if (isAccessTokenValid.value === isValid) {
        return isValid;
    }

    isAccessTokenValid.value = isValid;

    if (!isValid) {
        if (isSessionActive.value) stopSession();
        useNotificationSystem().addNotification({
            message: 'The access token is invalid',
            timeout: 2000,
            color: 'error',
            isActive: true,
        });
    } else {
        useNotificationSystem().addNotification({
            message: 'The access token is valid',
            timeout: 1000,
            color: 'success',
            isActive: true,
        });
    }

    return isValid;
}

// Notification System functionallity

/**
 * Ref which will hold the notification queue
 */
const notifications = ref(useNotificationSystem().notificationQueue);

/**
 * Function which will dismiss the notification
 * @param item The notification to dismiss
 */
function dismissNotification(item: Notification, index: number) {
    useNotificationSystem().removeNotification(item);
}

/**
 * Function which will calculate the margin for the notification
 * @param i The index of the notification
 */
function calcMargin(index: number): string {
    return index * 70 + 16 + 'px';
}
</script>

<style lang="scss">
*,
:after,
:before {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

body,
html {
    width: 100%;
    height: 100%;
    font-family: YouTube Sans, Roboto, sans-serif;
    overflow: hidden !important;
}

body {
    position: relative;
    min-height: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
    user-select: none;
}

.drag {
    -webkit-app-region: drag;
}

.no-drag {
    -webkit-app-region: no-drag;
}

.proper-height {
    // 56px is the height of the bottom navigation
    // 16px is the padding of the v-container which is at the bottom and top
    min-height: calc(100vh - 56px - 16px - 16px);
    max-height: calc(100vh - 56px - 16px - 16px);
    overflow: hidden;
}

#side-panel-container {
    overflow-y: auto;
    min-width: 375px;
    max-width: 375px;
    margin-right: 16px;
}

#video-stream-container {
    min-height: calc(100vh - 56px - 16px - 16px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

// Dialog Animation for Settings
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
    transition: transform 0.2s ease-in-out;
}

// Notification settings
.scrollable-content {
    overflow-wrap: break-word;
    overflow: auto;
    word-wrap: break-word;
    max-height: 48px;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
}

.scrollable-content:hover {
    scrollbar-color: #ffffff transparent;
}

.scrollable-content::-webkit-scrollbar {
    width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
    background-color: transparent;
}

.scrollable-content::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
}
</style>
