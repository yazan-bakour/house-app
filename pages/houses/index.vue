<script setup lang="ts">
import LoaderSvg from '~/components/LoaderSvg.vue'

useHead({
  title: 'Overview - House Management App',
})

const loading = false
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Houses</h1>
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
