<template>
    <v-app theme="dark">
        <!-- Main Content view-->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <v-row cols="12" no-gutters>
                    <v-col cols="2" md="4" id="panel">
                        <v-sheet
                            color="background"
                            rounded="lg"
                            class="proper-height"
                        >
                            <router-view />
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet class="proper-height center" rounded="lg">
                            <MainVideoStream />
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <!-- Bottom Navigation -->
        <v-bottom-navigation :elevation="24" bg-color="surface" grow>
            <v-btn to="/run" tonal prepend-icon="mdi-play" value="run">
                Capturing
            </v-btn>

            <v-btn to="/" tonal prepend-icon="mdi-monitor" value="source">
                Source
            </v-btn>

            <v-btn to="/regex" tonal prepend-icon="mdi-regex" value="regex">
                Regex
            </v-btn>
        </v-bottom-navigation>
    </v-app>
</template>

<script setup lang="ts">
import MainVideoStream from './components/MainVideoStream.vue';

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

.center {
    display: flex;
    align-items: center;
    justify-content: center;
}

#panel {
    overflow-y: auto;
    min-width: 375px;
    max-width: 375px;
    margin-right: 16px;
}
</style>
