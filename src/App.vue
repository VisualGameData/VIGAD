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
                to="/run"
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
                fullscreen
                :scrim="false"
                transition="dialog-bottom-transition"
            >
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" prepend-icon="mdi-regex">
                        Settings
                    </v-btn>
                </template>
                <v-card>
                    <v-toolbar color="primary">
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Settings</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn
                            @click="dialog = false"
                            color="primary"
                            prepend-icon="mdi-play"
                            variant="tonal"
                            class="rounded-pill"
                            >Start session</v-btn
                        >
                    </v-toolbar>

                    <!-- Access Token -->
                    <v-list lines="one" subheader>
                        <v-list-subheader
                            >WebAPI access and key</v-list-subheader
                        >
                        <v-list-item>
                            <v-list-title
                                >Here is your personal access token which
                                enables others to access the data you are
                                providing.
                                <v-btn
                                    color="primary"
                                    class="rounded-pill ml-4"
                                    prepend-icon="mdi-refresh"
                                    variant="tonal"
                                    >Generate new Token</v-btn
                                >
                            </v-list-title>
                        </v-list-item>

                        <v-list-item>
                            <v-list-title>
                                <!-- TODO: Input field only shows text when selected -->
                                <v-text-field
                                    v-model="accessToken"
                                    style="width: 450px"
                                    class="pt-2"
                                    variant="outlined"
                                    label="Access Token"
                                    name="apiAccessToken"
                                    append-icon="mdi-content-copy"
                                    :append-inner-icon="
                                        tokenVisibility
                                            ? 'mdi-eye-outline'
                                            : 'mdi-eye-off-outline'
                                    "
                                    :type="
                                        tokenVisibility ? 'text' : 'password'
                                    "
                                    @click:append-inner="toggleTokenVisibility"
                                    @click:append="copyToClipboard"
                                    persistent-placeholder
                                    hide-details
                                    readonly
                                ></v-text-field>
                            </v-list-title>
                        </v-list-item>
                    </v-list>

                    <v-divider />

                    <!-- Switches for data -->
                    <v-list lines="two" subheader>
                        <v-list-subheader
                            >What data will you share?</v-list-subheader
                        >
                        <v-list-item
                            class="pb-0 pt-0"
                            title="Stream Data"
                            subtitle="Stream data will be shared with the server"
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
                            title="Stream Regex & Capture Area Settings"
                            subtitle="Streams the regex and capture area settings to the server"
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
    </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { isRunning } from '@/composables/useRunning';

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
const tokenVisibility = ref(false);
const streamData = ref(false);
const streamRegexAndCaptureAreaSettings = ref(false);

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
        // TODO: Handle error with warning system
        console.error('Failed to copy access token: ', err);
    }
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
</style>
