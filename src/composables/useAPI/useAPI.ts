import useNotificationSystem from '@/composables/useNotificationSystem/useNotificationSystem';

/**
 * API usage composable
 */
export default function useAPI() {
    const baseUrl: string = 'https://api.example.com'; // Replace with your API base URL
    const bearerToken: string = 'YOUR_BEARER_TOKEN'; // Replace with your Bearer token

    /**
     * Perform a GET request to the specified API endpoint.
     * @param {string} endpoint - The API endpoint to fetch data from.
     * @returns {Promise<ApiResponse>} A Promise that resolves to the API response.
     * @throws {Error} If the request fails or the response is not OK.
     */
    const get = async (endpoint: string): Promise<ApiResponse> => {
        try {
            const url: string = `${baseUrl}/${endpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });

            if (!response.ok) {
                useNotificationSystem().createErrorNotification({
                    title: 'Failed to fetch data',
                });
                throw new Error('Failed to fetch data');
            }

            return await response.json() as ApiResponse;
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
     * @returns {Promise<ApiResponse>} A Promise that resolves to the API response.
     * @throws {Error} If the request fails or the response is not OK.
     */
    const post = async (endpoint: string, data: object): Promise<ApiResponse> => {
        try {
            const url: string = `${baseUrl}/${endpoint}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                useNotificationSystem().createErrorNotification({
                    title: 'Failed to post data',
                });
                throw new Error('Failed to post data');
            }

            return await response.json() as ApiResponse;
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

interface ApiResponse {
    // Define the structure of your API response here
}