import { ref } from 'vue';

export const notificationQueue = ref<Notification[]>([]);

/**
 * Function that can be used store and handle notifications
 */
export const useNotificationSystem = () => {
    /**
     * Function that can be used to add a notification to the queue
     * @param notification The notification to add to the queue.
     */
    const addNotification = (notification: Notification) => {
        notificationQueue.value.push(notification);
    };

    /**
     * Function that can be used to remove a Notification from the queue.
     * @param notification The notification to remove from the queue.
     */
    const removeNotification = (notification: Notification) => {
        const index = notificationQueue.value.indexOf(notification);
        if (index > -1) {
            notificationQueue.value.splice(index, 1);
        }
    };

    return {
        addNotification,
        removeNotification,
        notificationQueue,
    };
};

/**
 * Interface that can be used to define a warning.
 */
export interface Notification {
    title: string; // the title of the Notification
    message: string; // the message to display
    timeout?: number; // in milliseconds
    color?: string; // can be hex, rgb, rgba, hsl, hsla, or something like warning, error, info, success more info: https://vuetifyjs.com/en/api/v-snackbar/#props-color
    isActive: true;
}
