// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BeforeConstraint from '@/components/capture-area/BeforeConstraint/BeforeConstraint.vue';

describe('BeforeConstraint', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(BeforeConstraint, {
            propsData: {
                captureAreaId: 1,
            },
        });
    });

    afterEach(() => {
        wrapper.destroy();
    });

    it('updates the constraint regex when the input value changes', async () => {
        const input = wrapper.find('input');
        input.setValue('new constraint regex');
        await input.trigger('input');
        expect(wrapper.vm.beforeValueConstraint).toBe('new constraint regex');
    });

    it('updates the matching option when a new option is selected', async () => {
        const select = wrapper.findAll('select').at(0);
        select.element.value = 'exact';
        await select.trigger('change');
        expect(wrapper.vm.currentMatchingOption).toBe('exact');
    });

    it('updates the slicing option when a new option is selected', async () => {
        const select = wrapper.findAll('select').at(1);
        select.element.value = 'spaces';
        await select.trigger('change');
        expect(wrapper.vm.currentSlicingOption).toBe('spaces');
    });

    it('updates the similarity option when a new option is selected', async () => {
        const select = wrapper.findAll('select').at(2);
        select.element.value = 'num-let';
        await select.trigger('change');
        expect(wrapper.vm.currentSimilarityOption).toBe('num-let');
    });

    it('updates the number of matches when the input value changes', async () => {
        const select = wrapper.findAll('select').at(0);
        select.element.value = 'approximate';
        await select.trigger('change');
        const input = wrapper.find('input');
        input.setValue('2');
        await input.trigger('input');
        expect(wrapper.vm.currentNumberOfMatches).toBe(2);
    });

    it('resets all options when the reset button is clicked', async () => {
        wrapper.vm.beforeValueConstraint = 'new constraint regex';
        wrapper.vm.currentMatchingOption = 'exact';
        wrapper.vm.currentSlicingOption = 'spaces';
        wrapper.vm.currentSimilarityOption = 'num-let';
        wrapper.vm.currentNumberOfMatches = 2;
        const button = wrapper.find('button');
        await button.trigger('click');
        expect(wrapper.vm.beforeValueConstraint).not.toBe(
            'new constraint regex'
        );
        expect(wrapper.vm.currentMatchingOption).not.toBe('exact');
        expect(wrapper.vm.currentSlicingOption).not.toBe('spaces');
        expect(wrapper.vm.currentSimilarityOption).not.toBe('num-let');
        expect(wrapper.vm.currentNumberOfMatches).not.toBe(2);
    });
});
