import { ref } from 'vue';

export const warningsQueue = ref<Warning[]>([]);

/**
 * Function that can be used store and handle warnings.
 */
export const useWarningSystem = () => {
    /**
     * Function that can be used to add a warning to the queue but only if the warning is active (isActive = true)
     * @param warning The warning to add to the queue.
     */
    const addWarning = (warning: Warning) => {
        if (warning.isActive) warningsQueue.value.push(warning);
    };

    /**
     * Function that can be used to remove a warning from the queue.
     * @param warning The warning to remove from the queue.
     */
    const removeWarning = (warning: Warning) => {
        const index = warningsQueue.value.indexOf(warning);
        if (index > -1) {
            warningsQueue.value.splice(index, 1);
        }
        console.log(warningsQueue.value);
    };

    return {
        addWarning,
        removeWarning,
        warningsQueue,
    };
};

/**
 * Interface that can be used to define a warning.
 */
export interface Warning {
    message: string; // the message to display
    timeout?: number; // in milliseconds
    color?: string; // can be hex, rgb, rgba, hsl, hsla, or something like warning, error, info, success more info: https://vuetifyjs.com/en/api/v-snackbar/#props-color
    isMultiLine?: boolean;
    isActive: boolean; // if the warning is active, this has to be TRUE to show the warning in the queue at all, otherwise it will be removed from the queue
}
