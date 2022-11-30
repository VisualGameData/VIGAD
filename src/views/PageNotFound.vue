<template>
    <div>
        Page Not Found
        <br />
        <br />
        The page {{ useRouter().currentRoute.value.path }} does not exist yet.
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
</script>

<style lang="scss" scoped></style>
