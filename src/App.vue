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
                prepend-icon="mdi-regex"
                value="regex"
                @click="addSnackbar()"
            >
                Snackbar
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
                            class="rounded-pill"
                            prepend-icon="mdi-play"
                            variant="tonal"
                            @click="startSession()"
                            >Start Session</v-btn
                        >

                        <v-btn
                            v-else
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
                                    @click:append-inner="toggleTokenVisibility"
                                    persistent-placeholder
                                    hide-details
                                    readonly
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
            v-for="(notification, index) in displayedNotifications"
            v-model="notification.isActive"
            :key="index"
            :timeout="notification.timeout || 3000"
            @update:model-value="dismissNotification(notification, index)"
            :color="notification.color"
            location="top right"
            max-width="300px"
            height="60px"
            :style="{ 'margin-top': calcMargin(index) }"
            :multi-line="false"
            ref="notificationItem"
        >
            <div>
                {{ truncatedText(index) }}
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
import { computed, onMounted, ref } from 'vue';
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
});

// Dialog for settings
const dialog = ref(false);

// Sample UUID for access token testing
const accessToken = ref('17fe8fa2-1dc1-49ca-b7b2-b6ecf9068252');
const isSessionActive = ref(false);
const tokenVisibility = ref(false);
const streamData = ref(false);
const streamRegexAndCaptureAreaSettings = ref(false);

/**
 * Start the session
 */
function startSession() {
    isSessionActive.value = true;
    // TODO: Start session functionality
}

/**
 * Stop the session
 */
function stopSession() {
    isSessionActive.value = false;
    // TODO: Stop session functionality
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
    // TODO: Copy to clipboard functionality
    try {
        await navigator.clipboard.writeText(accessToken.value);
    } catch (err) {
        // TODO: Handle error with notification system
        console.error('Failed to copy access token: ', err);
    }
}

/**
 * Function which will regenerate a new access token
 */
async function regenerateAccessToken() {
    // TODO: Regenerate access token functionality
}

// Notification System functionallity

/**
 * Ref which will hold the notification queue
 */
const notifications = ref(useNotificationSystem().notificationQueue);

/**
 * Computed which will return only a small amount of notifications
 */
const displayedNotifications = computed((): Notification[] => {
    const notificationLimit = 4;
    return notifications.value.slice(0, notificationLimit);
});

/**
 * Function which will dismiss the notification
 * @param item The notification to dismiss
 */
function dismissNotification(item: Notification, index: number) {
    useNotificationSystem().removeNotification(item);
    calcMargin(index);
}

/**
 * Function which will truncate the text of the notification if it is too long to display
 * @param index The index of the notification
 */
function truncatedText(index: number): string {
    const limit = 75;
    if (notifications.value[index].message.length > limit) {
        return notifications.value[index].message.substring(0, limit) + '...';
    } else {
        return notifications.value[index].message;
    }
}

const previousSnackbarHeight = ref(0);
const notificationItem = ref(null);

/**
 * Function which will calculate the margin for the notification
 * @param i The index of the notification
 */
function calcMargin(index: number): string {
    return index * 70 + 'px';
}

let t = 0;
function addSnackbar() {
    t += 1;
    let mes = `Item ${t}`;

    useNotificationSystem().addNotification({
        title: 'Titel x ',
        message: mes,
        color: 'error',
        timeout: 10000,
        isActive: true,
    });

    useNotificationSystem().addNotification({
        title: 'Titely ',
        message: mes,
        color: 'info',
        timeout: -1,
        isActive: true,
    });

    useNotificationSystem().addNotification({
        title: 'Titel z',
        message: mes,
        color: 'info',
        timeout: -1,
        isActive: true,
    });

    useNotificationSystem().addNotification({
        title: 'awdawd',
        message: mes,
        color: 'info',
        timeout: -1,
        isActive: true,
    });

    useNotificationSystem().addNotification({
        title: 'awdawd',
        message: mes,
        color: 'info',
        timeout: -1,
        isActive: true,
    });

    useNotificationSystem().addNotification({
        title: 'Tihgzhgzhtel',
        message:
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        color: 'warning',
        timeout: -1,
        isActive: true,
    });

    useNotificationSystem().addNotification({
        title: 'awdawd',
        message: mes,
        color: 'info',
        timeout: -1,
        isActive: true,
    });
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

.overflow-wrap {
    overflow-wrap: break-word;
    overflow: auto;
    word-wrap: break-word;
    max-height: 250px;
}
</style>
