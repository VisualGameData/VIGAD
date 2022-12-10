<template>
    <v-card color="primary" :loading="loading" class="pa-2">
        <v-card-title class="header-container pa-2">
            {{ title }}
            <v-spacer></v-spacer>

            <slot name="actions"></slot>
        </v-card-title>
    </v-card>

    <v-container class="fill-height" fluid>
        <div>
            <slot name="default"></slot>
        </div>
    </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string;
    loading: boolean;
}>();
</script>

<style lang="scss" scoped>
.header-container {
    display: flex;
    justify-content: space-between;
}
</style>
