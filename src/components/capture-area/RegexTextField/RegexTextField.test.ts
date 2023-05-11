import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { shallowMount, mount } from '@vue/test-utils';
import RegexTextField from '@/components/capture-area/RegexTextField/RegexTextField.vue';
import { Vigad } from '@/proc/Vigad';
import {
    defaultValueRegexSettings,
    defaultAfterConstraintsSettings,
    defaultBeforeConstraintsSettings,
} from '@/components/capture-area/CaptureAreaSearchValue/ResetSettings';

describe('RegexTextField', () => {
    /**
     * Vigad instance
     */
    const vigad = ref(Vigad.getInstance());

    /**
     * Add capture area
     */
    vigad.value.addCaptureArea(100, 100, 0, 0);

    /**
     * Capture areas
     */
    const captureAreas = ref(vigad.value.getAllCaptureAreas());

    /**
     * Value regex
     */
    const valueRegex = vigad.value
        .getCaptureArea(captureAreas.value[0].getId())
        .getRegexGroups()[0]
        .getValueRegex();

    /**
     * Before constraint
     */
    const beforeConstraint = vigad.value
        .getCaptureArea(captureAreas.value[0].getId())
        .getRegexGroups()[0]
        .getConstraintRegex()[0];

    /**
     * After constraint
     */
    const afterConstraint = vigad.value
        .getCaptureArea(captureAreas.value[0].getId())
        .getRegexGroups()[0]
        .getConstraintRegex()[1];

    it('render with value regex', async () => {
        const props = {
            label: 'Search value',
            placeholder: 'Enter search value',
            prependIcon: 'mdi-table-column',
            captureAreaId: captureAreas.value[0].getId(),
            regex: valueRegex,
            resetOptions: defaultValueRegexSettings,
        };

        const wrapper = mount(RegexTextField as any, {
            props: props,
        });

        expect(wrapper.html());
        expect(wrapper.exists()).toBe(true);
    });

    it('render with before regex constraint', async () => {
        const props = {
            label: 'Before Constraint',
            placeholder: 'Enter a constraint value',
            prependIcon: 'mdi-table-column-plus-before',
            captureAreaId: captureAreas.value[0].getId(),
            regex: beforeConstraint,
            resetOptions: defaultBeforeConstraintsSettings,
        };

        const wrapper = mount(RegexTextField as any, {
            props: props,
        });

        expect(wrapper.html());
        expect(wrapper.exists()).toBe(true);
    });

    it('render with after regex constraint', async () => {
        const props = {
            label: 'After Constraint',
            placeholder: 'Enter a constraint value',
            prependIcon: 'mdi-table-column-plus-after',
            captureAreaId: captureAreas.value[0].getId(),
            regex: afterConstraint,
            resetOptions: defaultAfterConstraintsSettings,
        };

        const wrapper = mount(RegexTextField as any, {
            props: props,
        });

        expect(wrapper.html());
        expect(wrapper.exists()).toBe(true);
    });
});
