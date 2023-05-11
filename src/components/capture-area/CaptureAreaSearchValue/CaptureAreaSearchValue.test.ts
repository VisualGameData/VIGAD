import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { shallowMount } from '@vue/test-utils';
import CaptureAreaSearchValueVue from '@/components/capture-area/CaptureAreaSearchValue/CaptureAreaSearchValue.vue';
import RegexTextField from '@/components/capture-area/RegexTextField/RegexTextField.vue';
import { Vigad } from '@/proc/Vigad';
import {
    defaultValueRegexSettings,
    defaultAfterConstraintsSettings,
    defaultBeforeConstraintsSettings,
} from '@/components/capture-area/CaptureAreaSearchValue/ResetSettings';

describe('CaptureAreaSearchValue', () => {
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

    const props = {
        captureAreaId: captureAreas.value[0].getId(),
    };

    it('render with RegexTextField with proper props', () => {
        const wrapper = shallowMount(CaptureAreaSearchValueVue, {
            props: props,
        });

        expect(wrapper.findAllComponents(RegexTextField)).toHaveLength(3);
        expect(
            wrapper.findComponent({
                name: 'RegexTextField',
                props: {
                    label: 'Search value',
                    placeholder: 'Enter search value',
                    prependIcon: 'mdi-table-column',
                    captureAreaId: captureAreas.value[0].getId(),
                    regex: valueRegex,
                    resetOptions: defaultValueRegexSettings,
                },
            })
        ).toBeTruthy();
        expect(
            wrapper.findComponent({
                name: 'RegexTextField',
                props: {
                    label: 'Before Constraint',
                    placeholder: 'Enter a constraint value',
                    prependIcon: 'mdi-table-column-plus-before',
                    captureAreaId: captureAreas.value[0].getId(),
                    regex: beforeConstraint,
                    resetOptions: defaultBeforeConstraintsSettings,
                },
            })
        ).toBeTruthy();
        expect(
            wrapper.findComponent({
                name: 'RegexTextField',
                props: {
                    label: 'After Constraint',
                    placeholder: 'Enter a constraint value',
                    prependIcon: 'mdi-table-column-plus-after',
                    captureAreaId: captureAreas.value[0].getId(),
                    regex: afterConstraint,
                    resetOptions: defaultAfterConstraintsSettings,
                },
            })
        ).toBeTruthy();
    });
});
