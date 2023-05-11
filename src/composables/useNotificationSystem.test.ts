import { describe, it, expect, beforeEach } from 'vitest';
import useNotifications from '@/composables/useNotificationSystem';

// When the Notification is outsourced from  the App.vue properly in a proper own component, this test should be updated to reflect that and also check the component if the Notification is actually rendered.

describe('useNotifications Composable', () => {
    let notifications: any;
    beforeEach(() => {
        notifications = useNotifications();
    });

    it('should add a general notification and delete it afterwards', () => {
        notifications.createNotification({
            title: 'Test Notification',
            message: 'This is a test notification',
            autoClose: false,
            duration: 10,
        });

        expect(notifications.notifications.value.length).toBe(1);

        notifications.removeNotifications(
            notifications.notifications.value[0].id
        );

        expect(notifications.notifications.value.length).toBe(0);
    });

    it('should add a success notification and delete it afterwards', () => {
        notifications.createSuccessNotification({
            title: 'Success Notification',
            message: 'This is a success test notification',
            autoClose: false,
            duration: 10,
        });

        expect(notifications.notifications.value.length).toBe(1);

        notifications.removeNotifications(
            notifications.notifications.value[0].id
        );

        expect(notifications.notifications.value.length).toBe(0);
    });

    it('should add a warning notification and delete it afterwards', () => {
        notifications.createWarningNotification({
            title: 'Warning Notification',
            message: 'This is a warnign test notification',
            autoClose: false,
            duration: 10,
        });

        expect(notifications.notifications.value.length).toBe(1);

        notifications.removeNotifications(
            notifications.notifications.value[0].id
        );

        expect(notifications.notifications.value.length).toBe(0);
    });

    it('should add a error notification and delete it afterwards', () => {
        notifications.createErrorNotification({
            title: 'Error Notification',
            message: 'This is a error test notification',
            autoClose: false,
            duration: 10,
        });

        expect(notifications.notifications.value.length).toBe(1);

        notifications.removeNotifications(
            notifications.notifications.value[0].id
        );

        expect(notifications.notifications.value.length).toBe(0);
    });

    it('stopBodyOverflow adds hide-overflow class to document body', () => {
        const { stopBodyOverflow } = useNotifications();

        stopBodyOverflow();

        expect(document.body.classList.contains('hide-overflow')).toBe(true);
    });

    it('allowBodyOverflow removes hide-overflow class from document body', () => {
        const { allowBodyOverflow } = useNotifications();

        allowBodyOverflow();

        expect(document.body.classList.contains('hide-overflow')).toBe(false);
    });
});
