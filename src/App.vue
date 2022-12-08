<template>
    <v-app theme="dark">
        <!-- Main Content view-->
        <v-main>
            <v-container fluid> </v-container>
            <!-- Provides the application the proper gutter -->
            <v-container class="ma-0 pt-0 pb-0" fluid>
                <v-row cols="12" no-gutters>
                    <v-col cols="2" id="panel">
                        <v-sheet
                            class="changing-view"
                            min-height="85vh"
                            max-height="85vh"
                            rounded="lg"
                        >
                            <router-view />
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet
                            min-height="85vh"
                            max-height="85vh"
                            rounded="lg"
                        >
                            <MainVideoStream />
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>

        <!-- Bottom Navigation -->
        <v-bottom-navigation grow>
            <v-btn
                to="/run"
                tonal
                color="success"
                prepend-icon="mdi-play"
                value="run"
            >
                Capturing
            </v-btn>

            <v-btn
                to="/"
                tonal
                color="success"
                prepend-icon="mdi-monitor"
                value="source"
            >
                Source
            </v-btn>

            <v-btn
                to="/regex"
                tonal
                color="success"
                prepend-icon="mdi-regex"
                value="regex"
            >
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

.changing-view {
    overflow-y: scroll;
}
#panel {
    min-width: 300px;
    margin-right: 25px;
}
</style>
