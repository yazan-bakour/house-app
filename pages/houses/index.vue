<script setup lang="ts">
const loading = false
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Houses</h1>
      <NuxtLink to="/" class="back-button-label btn">Back</NuxtLink>
    </div>

    <div v-if="loading" class="loading">
      <LoaderSvg />
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
}
</style>
