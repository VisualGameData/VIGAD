import { nextTick, ref } from 'vue';

/**
 * Reactive boolean that can be used to force a component to rerender.
 */
const isRerendering = ref(true);

/**
 * Tries to rerender the component by removing it from the DOM and adding it back in.
 *
 * Only works if the component has a v-if="rerender" directive.
 */
export default function useForceRerender() {
    const forceRerender = async () => {
        // Remove component from the DOM
        isRerendering.value = false;

        // Wait for the change to get flushed to the DOM
        await nextTick();

        // Add the component back in
        isRerendering.value = true;
    };

    return {
        forceRerender,
        isRerendering,
    };
}
