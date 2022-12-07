import { nextTick, ref } from 'vue';

/**
 * Reactive boolean that can be used to force a component to rerender.
 */
export const rerender = ref(true);

/**
 * Tries to rerender the component by removing it from the DOM and adding it back in.
 *
 * Only works if the compnent has a v-if="rerender" directive. active
 */
export const forceRerender = async () => {
    // Remove component from the DOM
    rerender.value = false;

    // Wait for the change to get flushed to the DOM
    await nextTick();

    // Add the component back in
    rerender.value = true;
};
