// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LogOutput from '@/components/LogOutput/LogOutput.vue';

describe('LogOutput', () => {
    it('renders correctly', () => {
        const wrapper = shallowMount(LogOutput, {
            props: {
                captureAreaId: 1,
            },
        });

        expect(wrapper.exists()).toBe(true);
    });

    it('returns true when matchedElements is empty', () => {
        const wrapper = shallowMount(LogOutput, {
            props: {
                captureAreaId: 1,
            },
        });

        expect(wrapper.vm.matchedElementsIsEmpty).toBe(true);
    });

    it('shows "Start capturing first!" message when matchedElements is empty', () => {
        const wrapper = shallowMount(LogOutput, {
            props: {
                captureAreaId: 1,
            },
        });

        expect(wrapper.find('p').text()).toBe('Start capturing first!');
    });

    it('shows captured elements when matchedElements has elements', async () => {
        const wrapper = shallowMount(LogOutput, {
            props: {
                captureAreaId: 1,
            },
        });

        wrapper.setData({
            matchedElements: [
                {
                    match: {
                        index: 1,
                        element: 'example-element',
                    },
                    rating: 0.8,
                    timestamp: '10:30:00',
                },
                {
                    match: {
                        index: 2,
                        element: 'another-example-element',
                    },
                    rating: 0.6,
                    timestamp: '10:31:00',
                },
            ],
        });

        await wrapper.vm.$nextTick();

        const elements = wrapper.findAll('v-list-item');
        expect(elements.length).toBe(2);
        expect(elements.at(0).text()).toContain('example-element');
        expect(elements.at(1).text()).toContain('another-example-element');
    });

    it('displays captured elements correctly', async () => {
        const wrapper = shallowMount(LogOutput, {
            props: {
                captureAreaId: 1,
            },
        });

        wrapper.setData({
            matchedElements: [
                {
                    match: {
                        index: 1,
                        element: 'example-element',
                    },
                    rating: 0.8,
                    timestamp: '10:30:00',
                },
            ],
        });

        await wrapper.vm.$nextTick();

        const element = wrapper.find('v-list-item');
        expect(element.find('v-icon').attributes('color')).toBe('success');
        expect(element.find('v-list-item-title').text()).toBe('10:30:00');
        expect(element.text()).toContain('Element: example-element');
        expect(element.text()).toContain('Rating: 0.8');
    });
});
