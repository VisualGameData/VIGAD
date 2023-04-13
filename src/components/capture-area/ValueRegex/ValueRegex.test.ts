// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ValueRegex from '@/components/capture-area/ValueRegex/ValueRegex.vue';

describe('ValueRegex.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(ValueRegex, {
            props: {
                captureAreaId: 1,
            },
        });
    });

    it('renders the component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('updates the valueRegex when the input changes', async () => {
        const input = wrapper.find('[data-testid="valueRegexInput"]');
        const newValue = 'new value regex';
        await input.setValue(newValue);
        expect(wrapper.vm.valueRegex).toBe(newValue);
    });

    it('updates the matching option when the corresponding select changes', async () => {
        const select = wrapper.find('[data-testid="matchingSelect"]');
        const newValue = 'exact';
        await select.setValue(newValue);
        expect(wrapper.vm.currentMatchingOption).toBe(newValue);
    });

    it('updates the slicing option when the corresponding select changes', async () => {
        const select = wrapper.find('[data-testid="slicingSelect"]');
        const newValue = 'spaces';
        await select.setValue(newValue);
        expect(wrapper.vm.currentSlicingOption).toBe(newValue);
    });

    it('updates the similarity option when the corresponding select changes', async () => {
        const select = wrapper.find('[data-testid="similaritySelect"]');
        const newValue = 'let_num';
        await select.setValue(newValue);
        expect(wrapper.vm.currentSimilarityOption).toBe(newValue);
    });

    it('updates the number of matches when the input changes and the matching option is approximate', async () => {
        const select = wrapper.find('[data-testid="matchingSelect"]');
        await select.setValue('approximate');

        const input = wrapper.find('[data-testid="matchesInput"]');
        const newValue = 10;
        await input.setValue(newValue);
        expect(wrapper.vm.currentNumberOfMatches).toBe(newValue);
    });

    it('does not update the number of matches when the input changes and the matching option is exact', async () => {
        const select = wrapper.find('[data-testid="matchingSelect"]');
        await select.setValue('exact');

        const input = wrapper.find('[data-testid="matchesInput"]');
        const oldValue = wrapper.vm.currentNumberOfMatches;
        const newValue = 10;
        await input.setValue(newValue);
        expect(wrapper.vm.currentNumberOfMatches).toBe(oldValue);
    });

    it('resets the options when the reset button is clicked', async () => {
        const input = wrapper.find('[data-testid="valueRegexInput"]');
        const newValue = 'new value regex';
        await input.setValue(newValue);

        const select = wrapper.find('[data-testid="matchingSelect"]');
        await select.setValue('exact');

        const resetButton = wrapper.find('[data-testid="resetButton"]');
        await resetButton.trigger('click');

        expect(wrapper.vm.valueRegex).not.toBe(newValue);
        expect(wrapper.vm.currentMatchingOption).not.toBe('exact');
        expect(wrapper.vm.currentSlicingOption).toBe('substr');
        expect(wrapper.vm.currentSimilarityOption).toBe('none');
        expect(wrapper.vm.currentNumberOfMatches).toBe(1);
    });
});
