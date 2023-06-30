import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import LogOutput from '@/components/LogOutput/LogOutput.vue';
import { Vigad } from '@/proc/Vigad';

describe('CaptureAreaSearchValue', () => {
    /**
     * Vigad instance
     */
    const vigad = ref(Vigad.getInstance());

    /**
     * Add capture area
     */
    vigad.value.addCaptureArea();

    /**
     * Capture areas
     */
    const captureAreas = ref(vigad.value.getAllCaptureAreas());

    const props = {
        captureAreaId: captureAreas.value[0].getId(),
    };

    it('displays "Start capturing first!" when matchedElements is empty', async () => {
        const wrapper = mount(LogOutput, {
            props: props,
        });
        const message = wrapper.find('p');
        expect(message.exists()).toBe(true);
    });
});
