// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import CaptureAreaSearchValue from '@/components/capture-area/CaptureAreaSearchValue/CaptureAreaSearchValue.vue';
import ValueRegex from '@/components/capture-area/ValueRegex/ValueRegex.vue';
import BeforeConstraint from '@/components/capture-area/BeforeConstraint/BeforeConstraint.vue';
import AfterConstraint from '@/components/capture-area/AfterConstraint/AfterConstraint.vue';

describe('CaptureAreaSearchValue', () => {
    it('renders ValueRegex component with correct props', () => {
        const captureAreaId = 123;
        const wrapper = shallowMount(CaptureAreaSearchValue, {
            props: { captureAreaId },
        });
        const valueRegex = wrapper.findComponent(ValueRegex);
        expect(valueRegex.props('captureAreaId')).toBe(captureAreaId);
    });

    it('renders BeforeConstraint component with correct props', () => {
        const captureAreaId = 123;
        const wrapper = shallowMount(CaptureAreaSearchValue, {
            props: { captureAreaId },
        });
        const beforeConstraint = wrapper.findComponent(BeforeConstraint);
        expect(beforeConstraint.props('captureAreaId')).toBe(captureAreaId);
    });

    it('renders AfterConstraint component with correct props', () => {
        const captureAreaId = 123;
        const wrapper = shallowMount(CaptureAreaSearchValue, {
            props: { captureAreaId },
        });
        const afterConstraint = wrapper.findComponent(AfterConstraint);
        expect(afterConstraint.props('captureAreaId')).toBe(captureAreaId);
    });
});
