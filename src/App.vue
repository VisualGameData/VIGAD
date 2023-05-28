<template>
    <v-app theme="dark">
        <!-- Main Content view-->
        <v-main>
            <!-- Provides the application the proper gutter -->
            <v-container fluid>
                <v-row cols="12" no-gutters>
                    <v-col cols="2" md="4" id="side-panel-container">
                        <v-sheet color="background" rounded="lg" class="proper-height">
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
        <Navigation />

        <!-- Notification Prompts -->
        <NotificantionProvider :location="NotificationAnchorPosition.TOP_RIGHT" />
    </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainVideoStream from '@/components/MainVideoStream/MainVideoStream.vue';
import Navigation from '@/components/Navigation/Navigation.vue';
import NotificantionProvider from '@/components/Notifications/NotificationProvider/NotificationProvider.vue';
import { NotificationAnchorPosition } from '@/components/Notifications/NotificationAnchorPosition';
import useStreamHandler from '@/composables/useStreamHandler/useStreamHandler';

// Force the application to navigate to the default route
const router = useRouter();

// Get the default preview video stream function
const { setDefaultPreviewVideoStream } = useStreamHandler();

onMounted(async () => {
    // set the default preview video stream
    await setDefaultPreviewVideoStream();
    // navigate to the default route
    router.push('/');
});
</script>

<style lang="scss">
// Variables
$bottom-nav-height: 56px;
$container-padding: 16px;
$viewport-height: 100vh;

// Global styles
*,
:after,
:before {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

// Body styles
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

// Classes
.drag {
    -webkit-app-region: drag;
}

.no-drag {
    -webkit-app-region: no-drag;
}

.proper-height {
    min-height: calc(#{$viewport-height} - #{$bottom-nav-height} - #{$container-padding} - #{$container-padding});
    max-height: calc(#{$viewport-height} - #{$bottom-nav-height} - #{$container-padding} - #{$container-padding});
    overflow: hidden;
}

// Sections
#side-panel-container {
    overflow-y: auto;
    min-width: 375px;
    max-width: 375px;
    margin-right: $container-padding;
}

#video-stream-container {
    min-height: calc(#{$viewport-height} - #{$bottom-nav-height} - #{$container-padding} - #{$container-padding});
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
