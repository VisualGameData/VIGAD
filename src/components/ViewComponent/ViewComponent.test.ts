import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';

describe('ViewComponent', () => {
    const title = 'Test Title';

    it('Render title prop', () => {
        const wrapper = shallowMount(ViewComponent as any, {
            props: {
                title: title,
                loading: false,
            },
        });
        expect(wrapper.find('.header-container').text()).toContain(title);
    });

    it('Render title prop and is loading', () => {
        const wrapper = shallowMount(ViewComponent as any, {
            props: {
                title: title,
                loading: true,
            },
        });
        expect(wrapper.find('.header-container').text()).toContain(title);
    });

    it('Render default slot content', () => {
        const wrapper = shallowMount(ViewComponent as any, {
            props: {
                title: title,
                loading: false,
            },
            slots: { default: '<div class="my-slot-content"></div>' },
        });
        expect(wrapper.find('.my-slot-content').exists()).toBe(true);
    });

    it('Render action slot content', () => {
        const wrapper = shallowMount(ViewComponent as any, {
            props: {
                title: title,
                loading: false,
            },
            slots: { actions: '<div class="my-actions-content"></div>' },
        });
        expect(wrapper.find('.my-actions-content').exists()).toBe(true);
    });

    it('Render action and default slot content at the same time', () => {
        const wrapper = shallowMount(ViewComponent as any, {
            slots: {
                props: {
                    title: title,
                    loading: false,
                },
                default: '<div class="my-slot-content"></div>',
                actions: '<div class="my-actions-content"></div>',
            },
        });

        expect(wrapper.find('.my-slot-content').exists()).toBe(true);
        expect(wrapper.find('.my-actions-content').exists()).toBe(true);
    });
});
