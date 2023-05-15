import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import {
    useForceRerender,
    isRerendering,
} from '@/composables/useForceRerender/useForceRerender';

describe('useForceRerender Composable', () => {
    it('should trigger a rerender when called', async () => {
        const text = 'Component to rerender';

        const wrapper = mount({
            template: `
                <div v-if="isRerendering">
                    <p>${text}</p>
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
        expect(wrapper.text()).toBe(text);
    });
});
