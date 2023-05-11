<template>
    <div
        class="notification-prompt"
        :style="`--toast-duration: ${duration}s; --toast-color: ${notificationColor}`"
        @click.prevent="close"
        :ref="id"
    >
        <div class="notification-body">
            <v-icon
                :color="notificationIconColor"
                :icon="`mdi-${notificationIcon}`"
            ></v-icon>
            <v-divider vertical />
            <div class="notification-content">
                <div class="notification-content__title">
                    {{ notificationTitle }}
                </div>

                <p v-if="message" class="notification-content__message">
                    {{ message }}
                </p>
            </div>
        </div>
        <div v-if="autoClose" class="notification-duration-progress-bar"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

/**
 * Props for our component, these are the same as Notitfication interface.
 */
const props = defineProps({
    id: { type: String, required: true },
    type: {
        type: String,
        default: 'info',
        required: false,
    },
    title: { type: String, default: null, required: false },
    message: {
        type: String,
        default: 'Ooops! A message was not provided.',
        required: false,
    },
    autoClose: { type: Boolean, default: true, required: false },
    duration: { type: Number, default: 5, required: false }, // in seconds
});

/**
 * Defining emits for closing a notification
 */
const emit = defineEmits<{
    (e: 'close'): void;
}>();

/**
 * A reactive value to store the timer
 */
const timer = ref<any>(-1);
const startedAt = ref<number>(0);
const delay = ref<number>(0);

/**
 * A lifecycle hook to start the timer for auto closing the notification if autoClose is true
 */
onMounted(() => {
    if (props.autoClose) {
        startedAt.value = Date.now();
        delay.value = props.duration * 1000;
        timer.value = setTimeout(close, delay.value);
    }
});

// a computed property to set
// the icon for the notification
const notificationIcon = computed(() => {
    switch (props.type) {
        case 'error':
            return 'alert';
        case 'warning':
            return 'alert-circle';
        case 'success':
            return 'check';
        default:
            return 'information';
    }
});

/**
 * A computed property to set the color for the notification based on the type of notification provided
 */
const notificationColor = computed(() => {
    switch (props.type) {
        case 'error':
            return '#c7677a';
        case 'warning':
            return '#f18c20';
        case 'success':
            return '#5cae53';
        default:
            return '#bb86fc';
    }
});

/**
 * A computed property to set the icon color for the notification based on the type of notification provided
 */
const notificationIconColor = computed(() => {
    switch (props.type) {
        case 'error':
            return 'error';
        case 'warning':
            return 'warning';
        case 'success':
            return 'success';
        default:
            return 'primary';
    }
});

/**
 * A computed property to set the title for the notification
 */
const notificationTitle = computed(() => {
    return props.title && props.title !== null ? props.title : 'Notification';
});

/**
 * A method to close the notification and emit the action
 */
const close = () => {
    emit('close');
};
</script>

<style lang="scss" scoped>
.notification-prompt {
    --toast-color: #3cff00;
    cursor: pointer;
    max-width: 450px;
    position: relative;
    background: #121212;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.08),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    min-height: 4rem;
    padding-inline: 1.5rem;
    padding-block: 1.2rem;
    transition: all 0.3s ease-in-out;
    border-radius: 8px !important;

    .notification-body {
        display: flex;
        gap: 1.4rem;
        place-items: center;
        .notification-content {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;

            &__title {
                font-weight: 600;
            }
            &__message {
                max-height: 150px;
                overflow-y: auto;

                overflow-wrap: break-word;
                word-wrap: break-word;
                scrollbar-width: thin;
                scrollbar-color: #ccc transparent;
                &:hover {
                    scrollbar-color: #ffffff transparent;
                }
                &::-webkit-scrollbar {
                    width: 6px;
                }
                &::-webkit-scrollbar-track {
                    background-color: transparent;
                }
                &::-webkit-scrollbar-thumb {
                    background-color: #ccc;
                    border-radius: 10px;
                }
            }
        }
    }

    .notification-duration-progress-bar {
        position: absolute;
        bottom: 0px;
        left: 0;
        height: 0.4rem;
        width: 100%;
        background: var(--toast-color);
        animation: progress var(--toast-duration) ease-in-out forwards;
        border-radius: 8px !important;
    }

    @keyframes progress {
        to {
            width: 0;
        }
    }

    @keyframes toast-fade-in {
        to {
            opacity: 1;
        }
    }

    @keyframes toast-fade-out {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }
}
</style>
