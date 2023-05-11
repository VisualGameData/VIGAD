import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MainVideoStream from '@/components/MainVideoStream/MainVideoStream.vue';

describe('MainVideoStream.vue', () => {
    it('renders the video stream', () => {
        const wrapper = mount(MainVideoStream);
        expect(wrapper.find('.video-stream')).toBeTruthy();
    });

    it('renders the video element', () => {
        const wrapper = mount(MainVideoStream);
        expect(wrapper.find('#mainVideo')).toBeTruthy();
    });
});
