import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

/**
 * API usage composable
 */
export default function useAPI() {
    /**
     * Perform a GET request to the specified API endpoint.
     * @param {string} endpoint - The API endpoint to fetch data from.
     * @returns {Promise<object>} A Promise that resolves to the API response.
     * @throws {Error} If the request fails or the response is not OK.
     */
    const get = async (endpoint: string): Promise<object> => {
        try {
            const url = `${import.meta.env.VITE_BASEURL}/${endpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_BEARERTOKEN}`,
                },
            });

            if (!response.ok) {
                useNotificationSystem().createErrorNotification({
                    title: 'Failed to fetch data',
                });
                throw new Error('Failed to fetch data');
            }

            return await response.json();
        } catch (error) {
            useNotificationSystem().createErrorNotification({
                title: 'Error occurred while fetching data',
                message: `${error}`,
            });
            throw error;
        }
    };

    /**
     * Perform a POST request to the specified API endpoint.
     * @param {string} endpoint - The API endpoint to post data to.
     * @param {object} data - The data to be posted to the API.
     * @returns {Promise<object>} A Promise that resolves to the API response.
     * @throws {Error} If the request fails or the response is not OK.
     */
    const post = async (endpoint: string, data: object): Promise<object> => {
        try {
            const url = `${import.meta.env.VITE_BASEURL}/${endpoint}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_BEARERTOKEN}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                useNotificationSystem().createErrorNotification({
                    title: 'Failed to post data',
                });
                throw new Error('Failed to post data');
            }

            return await response.json();
        } catch (error) {
            useNotificationSystem().createErrorNotification({
                title: 'Error occurred while posting data',
                message: `${error}`,
            });
            throw error;
        }
    };

    return {
        get,
        post,
    };
}
