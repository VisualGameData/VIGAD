<template>
  Page Not Found
  <font-awesome-icon :icon="['fas', 'ban']" />
  <br />
  <br />
  The page {{ useRouter().currentRoute.value.path }} does not exist yet.
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
</script>

<style lang="scss" scoped></style>
