import { ref } from 'vue';

/**
 * notifications list
 */
const notifications = ref<Notification[]>([]);

export default function useNotifications() {
    /**
     * Create a notification
     * @param options
     */
    const createNotification: CreateNotification = (options) => {
        const _options = Object.assign(
            { ...defaultNotificationOptions },
            options
        );

        notifications.value.push(
            ...[
                {
                    id: createUUID(),
                    ..._options,
                },
            ]
        );
    };

    /**
     * Create an error notification
     * @param options
     */
    const createErrorNotification: CreateNotification = (options) => {
        createNotification({
            type: 'error',
            title: 'Yikes. Something went wrong.',
            duration: 8,
            ...options,
        });
    };

    /**
     * Create a success notification
     * @param options
     */
    const createSuccessNotification: CreateNotification = (options) => {
        createNotification({ type: 'success', title: 'Success!', ...options });
    };

    /**
     * Create a warning notification
     * @param options
     */
    const createWarningNotification: CreateNotification = (options) => {
        createNotification({
            type: 'warning',
            title: 'Something to lookout for.',
            duration: 8,
            ...options,
        });
    };

    /**
     * Remove notification from the list
     * @param id
     */
    const removeNotifications = (id: string) => {
        const index = notifications.value.findIndex((item) => item.id === id);
        if (index !== -1) notifications.value.splice(index, 1);
    };

    /**
     * Stop body overflow when notification is shown
     */
    const stopBodyOverflow = () => {
        document && document.body.classList.add(...['hide-overflow']);
    };

    /**
     * Allow body overflow after notification is removed
     */
    const allowBodyOverflow = () => {
        document && document.body.classList.remove(...['hide-overflow']);
    };

    return {
        notifications,
        createNotification,
        createSuccessNotification,
        createErrorNotification,
        createWarningNotification,
        removeNotifications,
        stopBodyOverflow,
        allowBodyOverflow,
    };
}

/**
 * Create a unique id
 * @returns a unique id as a string
 */
function createUUID(): string {
    let dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
    return uuid;
}

/**
 * Notification interface
 */
export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    autoClose: boolean;
    duration: number;
}

/**
 * Create notification function
 */
export type CreateNotification = {
    (options: {
        type?: string;
        title?: string;
        message?: string;
        autoClose?: boolean;
        duration?: number;
    }): void;
};

/**
 * Default notification options
 */
const defaultNotificationOptions = {
    type: 'info',
    title: 'Info Notification',
    message: '',
    autoClose: true,
    duration: 5,
};
