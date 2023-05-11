<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ToastNotification from '@/components/ToastNotification/ToastNotification.vue';
import useNotifications from '@/composables/useNotificationSystem/useNotificationSystem';

const notifications = ref(useNotifications().notifications);
const removeNotifications = useNotifications().removeNotifications;
const stopBodyOverflow = useNotifications().stopBodyOverflow;
const allowBodyOverflow = useNotifications().allowBodyOverflow;
</script>

<style lang="scss" scoped>
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
