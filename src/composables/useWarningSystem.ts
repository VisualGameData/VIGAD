import { ref } from 'vue';

export const warningsQueue = ref<Warning[]>([]);

/**
 * Function that can be used store and handle warnings.
 */
export const useWarningSystem = () => {
    /**
     * Function that can be used to add a warning to the queue.
     * @param warning The warning to add to the queue.
     */
    const addWarning = (warning: Warning) => {
        warningsQueue.value.push(warning);
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
    message: string;
    timeout?: number;
    color?: string;
    isMultiLine?: boolean;
    isActive: boolean;
}
