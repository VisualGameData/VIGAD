import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import ViewComponent from '@/components/ViewComponent/ViewComponent.vue';

describe('ViewComponent', () => {
  it('Render title prop', () => {
    const title = 'Test Title'
    const wrapper = shallowMount(ViewComponent, {
      props: 
      { 
        title: title,
        loading: false,
      }
    })
    expect(wrapper.find('.header-container').text()).toContain(title)
  })

  it('Render default slot content', () => {
    const wrapper = shallowMount(ViewComponent, {
      slots: { default: '<div class="my-slot-content"></div>' }
    })
    expect(wrapper.find('.my-slot-content').exists()).toBe(true)
  })

  it('Render action slot content', () => {
    const wrapper = shallowMount(ViewComponent, {
      slots: { actions: '<div class="my-actions-content"></div>' }
    })
    expect(wrapper.find('.my-actions-content').exists()).toBe(true)
  })
})
