<template>
    <!-- Title thingy -->
    <v-card
        :loading="loading"
        :title="title"
        :subtitle="subtitle"
        variant="tonal"
        color="primary"
        rounded="rounded"
        class="pa-2 mb-4"
    ></v-card>

    <slot name="default"></slot>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string;
    subtitle: string;
    loading: boolean;
}>();
</script>

<style lang="scss" scoped></style>
