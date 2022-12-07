<!-- This is just a simple component for the panel side which enables a loading and -->
<!-- Can be extended in the future -->
<!-- TODO: adjust this component !! -->
<template>
    <v-card
        :loading="loading"
        :title="title"
        :subtitle="subtitle"
        variant="tonal"
        color="primary"
        rounded="rounded"
        class="pa-2 mb-4"
    >
    </v-card>
    <slot name="actions"></slot>
    <v-divider class="my-2"></v-divider>
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
