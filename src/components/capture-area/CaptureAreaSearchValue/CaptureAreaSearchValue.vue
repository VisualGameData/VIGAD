<template>
    <div>
        <div class="pt-2 regex-definition">
            <ValueRegex :captureAreaId="captureAreaId" />
        </div>

        <div class="mt-4 regex-constraint-before-definition">
            <BeforeConstraint :captureAreaId="captureAreaId" />
        </div>

        <div class="mt-4 regex-constraint-after-definition">
            <AfterConstraint :captureAreaId="captureAreaId" />
        </div>

        <div class="mt-4 actions">
            <v-btn
                class="rounded-pill"
                color="error"
                prepend-icon="mdi-delete"
                rounded="lg"
                @click="vigad.deleteCaptureArea(captureAreaId)"
                >Delete</v-btn
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Vigad } from '@/proc/Vigad';
import ValueRegex from '@/components/capture-area/ValueRegex/ValueRegex.vue';
import BeforeConstraint from '@/components/capture-area/BeforeConstraint/BeforeConstraint.vue';
import AfterConstraint from '@/components/capture-area/AfterConstraint/AfterConstraint.vue';

const props = defineProps<{
    captureAreaId: number;
}>();

/**
 * Get singelton instance reference to vigad
 */
const vigad = ref(Vigad.getInstance());
</script>

<style lang="scss" scoped>
.actions {
    display: flex;
    justify-content: space-between;
}
</style>
