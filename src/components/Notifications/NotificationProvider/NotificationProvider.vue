<template>
    <Teleport to="body">
        <transition-group
            tag="div"
            name="notifications-container"
            class="notifications-containers"
            :class="notificationContainerLocation"
            @before-enter="stopBodyOverflow"
            @after-enter="allowBodyOverflow"
            @before-leave="stopBodyOverflow"
            @after-leave="allowBodyOverflow"
        >
            <NotificationPrompt
                v-for="item in notifications"
                :id="item.id"
                :key="item.id"
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
            ></NotificationPrompt>
        </transition-group>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NotificationPrompt from '@/components/Notifications/NotificationPrompt/NotificationPrompt.vue';
import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';
import { NotificationAnchorPosition } from '@/components/Notifications/NotificationAnchorPosition';

const {
    notifications,
    removeNotifications,
    stopBodyOverflow,
    allowBodyOverflow,
} = useNotificationSystem();

/**
 * Props to define the location of the notification container
 */
const props = defineProps({
    location: {
        type: String as () => NotificationAnchorPosition,
        default: NotificationAnchorPosition.TOP_RIGHT,
        required: false,
    },
});

/**
 * A computed value to determine the location of the notification container and apply the appropriate class
 */
const notificationContainerLocation = computed(() => {
    switch (props.location) {
        case NotificationAnchorPosition.TOP_RIGHT:
            return 'top-right';
        case NotificationAnchorPosition.TOP_LEFT:
            return 'top-left';
        case NotificationAnchorPosition.BOTTOM_RIGHT:
            return 'bottom-right';
        case NotificationAnchorPosition.BOTTOM_LEFT:
            return 'bottom-left';
        default:
            return 'top-right';
    }
});
</script>

<style lang="scss" scoped>
.notifications-containers {
    z-index: 9999;
    position: absolute;
    display: flex;
    gap: 0.8rem;
}

.notifications-container-enter-active {
    animation: notification-fade-in 0.35s ease-in-out;
}
.notifications-container-leave-active {
    animation: notification-fade-in 0.35s ease-in-out reverse;
}

@keyframes notification-fade-in {
    from {
        opacity: 0;
        transform: scale(0.4);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

// Notification Container Locations

.top-right {
    top: 24px;
    right: 24px;
    flex-direction: column-reverse;
}

.top-left {
    top: 24px;
    left: 24px;
    flex-direction: column-reverse;
}

.bottom-right {
    bottom: 24px;
    right: 24px;
    flex-direction: column;
}

.bottom-left {
    bottom: 24px;
    left: 24px;
    flex-direction: column;
}
</style>
