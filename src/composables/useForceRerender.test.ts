import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import {
    useForceRerender,
    isRerendering,
} from '@/composables/useForceRerender';

describe('useForceRerender', () => {
    it('should trigger a rerender when called', async () => {
        const wrapper = mount({
            template: `
                <div v-if="isRerendering">
                    <p>Component to rerender</p>
                </div>
            `,
            setup() {
                return {
                    isRerendering,
                };
            },
        });

        // Call the useForceRerender composable
        await useForceRerender();

        // Check that the component has rerendered
        expect(wrapper.text()).toBe('Component to rerender');
    });
});
