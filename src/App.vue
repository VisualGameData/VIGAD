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

        <Navigation />

        <Teleport to="body">
            <transition-group
                name="toast-notification"
                tag="div"
                class="toast-notifications"
                @before-enter="stopBodyOverflow"
                @after-enter="allowBodyOverflow"
                @before-leave="stopBodyOverflow"
                @after-leave="allowBodyOverflow"
            >
                <toast-notification
                    v-for="(item, idx) in notifications"
                    :key="item.id"
                    :id="item.id"
                    :type="item.type"
                    :title="item.title"
                    :message="item.message"
                    :auto-close="item.autoClose"
                    :duration="item.duration"
                    @close="
                        () => {
                            removeNotifications(item.id);
                        }
                    "
                ></toast-notification>
            </transition-group>
        </Teleport>
    </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import useNotifications from '@/composables/useNotificationSystem';
import ToastNotification from '@/components/ToastNotification/ToastNotification.vue';
import Navigation from '@/components/Navigation/Navigation.vue';

const notifications = ref(useNotifications().notifications);
const removeNotifications = useNotifications().removeNotifications;
const stopBodyOverflow = useNotifications().stopBodyOverflow;
const allowBodyOverflow = useNotifications().allowBodyOverflow;

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

.toast-notifications {
    z-index: 9999;
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.8rem;
}

.toast-notification-enter-active {
    animation: toast-fade-in 0.5s ease-in-out;
}
.toast-notification-leave-active {
    animation: toast-fade-in 0.5s ease-in-out reverse;
}

@keyframes toast-fade-in {
    from {
        opacity: 0;
        transform: scale(0.4);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
