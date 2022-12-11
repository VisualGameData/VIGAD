<template>
    <v-alert
        border="start"
        icon="mdi-information"
        :title="title"
        type="success"
        class="log-output-container"
    >
        {{ log }}
    </v-alert>
</template>

<script setup lang="ts">
import { type } from 'os';

const props = defineProps<{
    title: string;
    log: string;
}>();
</script>

<style lang="scss" scoped>
.log-output-container {
    max-height: 350px;
    overflow-y: auto;
}
</style>
