// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import MainVideoStream from '@/components/MainVideoStream/MainVideoStream.vue';
import { Vigad } from '@/proc/Vigad';

describe('MainVideoStream', () => {
    let wrapper;
    let vigadInstance;

    beforeEach(() => {
        // Create a mock instance of Vigad
        vigadInstance = new Vigad();
        // Stub the methods of the Vigad instance that are used in the component
        vigadInstance.getStreamHandlerInstance = jest.fn().mockReturnValue({
            setDefaultVideoStream: jest.fn(),
        });
        vigadInstance.getAllCaptureAreas = jest.fn().mockReturnValue([]);

        // Shallow mount the MainVideoStream component
        wrapper = shallowMount(MainVideoStream, {
            global: {
                // Provide the mock Vigad instance as a global dependency
                provide: {
                    Vigad: {
                        getInstance: jest.fn().mockReturnValue(vigadInstance),
                    },
                },
            },
        });
    });

    it('renders the component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('sets the default video stream on mount', async () => {
        // Mock the setDefaultVideoStream method of the streamHandler
        vigadInstance
            .getStreamHandlerInstance()
            .setDefaultVideoStream.mockResolvedValue();

        await wrapper.vm.$options.onMounted[0]();
        expect(
            vigadInstance.getStreamHandlerInstance().setDefaultVideoStream
        ).toHaveBeenCalled();
    });

    // Add more tests as needed
});
