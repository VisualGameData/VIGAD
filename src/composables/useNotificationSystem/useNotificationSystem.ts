import { ref } from 'vue';
import useTokenGenerator from '@/composables/useTokenGenerator/useTokenGenerator';
const { rules } = useTokenGenerator();

/**
 * notifications list
 */
const notifications = ref<Notification[]>([]);

/**
 * Notification System Composable
 */
export default function useNotificationSystem() {
    const { generateToken } = useTokenGenerator();

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
                    id: generateRandomToken(),
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
 * Function which will generate a random token
 */
function generateRandomToken(): string {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    const characterSet =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=?';
    const token = Array.from(buffer)
        .map((x: number) => characterSet[x % characterSet.length])
        .join('');
    if (
        rules.lowercase(token) === true &&
        rules.uppercase(token) === true &&
        rules.special(token) === true &&
        rules.number(token) === true &&
        rules.min(token) === true
    ) {
        return token;
    } else {
        return generateRandomToken();
    }
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
