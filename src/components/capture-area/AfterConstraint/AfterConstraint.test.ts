// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AfterConstraint from '@/components/capture-area/AfterConstraint/AfterConstraint.vue';

describe('AfterConstraint', () => {
    test('updates afterValueConstraint value when the v-model changes', async () => {
        const wrapper = mount(AfterConstraint, {
            props: {
                captureAreaId: 1,
            },
        });

        const newValue = 'new value';

        const textInput = wrapper.find('input');
        await textInput.setValue(newValue);

        expect(wrapper.vm.afterValueConstraint).toBe(newValue);
    });

    test('updates currentMatchingOption value when the v-model changes', async () => {
        const wrapper = mount(AfterConstraint, {
            props: {
                captureAreaId: 1,
            },
        });

        const newValue = 'Approximate';

        const selectInput = wrapper.findAll('select').at(0);
        await selectInput.setValue(newValue);

        expect(wrapper.vm.currentMatchingOption).toBe(newValue);
    });

    test('updates currentSlicingOption value when the v-model changes', async () => {
        const wrapper = mount(AfterConstraint, {
            props: {
                captureAreaId: 1,
            },
        });

        const newValue = 'Entire string';

        const selectInput = wrapper.findAll('select').at(1);
        await selectInput.setValue(newValue);

        expect(wrapper.vm.currentSlicingOption).toBe(newValue);
    });

    test('updates currentSimilarityOption value when the v-model changes', async () => {
        const wrapper = mount(AfterConstraint, {
            props: {
                captureAreaId: 1,
            },
        });

        const newValue = 'None';

        const selectInput = wrapper.findAll('select').at(2);
        await selectInput.setValue(newValue);

        expect(wrapper.vm.currentSimilarityOption).toBe(newValue);
    });

    test('updates currentNumberOfMatches value when the v-model changes', async () => {
        const wrapper = mount(AfterConstraint, {
            props: {
                captureAreaId: 1,
            },
        });

        const newValue = '5';

        const textInput = wrapper.find('input[type="number"]');
        await textInput.setValue(newValue);

        expect(wrapper.vm.currentNumberOfMatches).toBe(Number(newValue));
    });
});
