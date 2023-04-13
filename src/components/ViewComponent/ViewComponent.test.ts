// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';

describe('ViewComponent', () => {
    it('renders the title prop', () => {
        const title = 'Test Title';
        const wrapper = mount(ViewComponent, {
            props: {
                title,
            },
        });
        expect(wrapper.find('.header-container').text()).toContain(title);
    });
});
