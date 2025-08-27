<script setup lang="ts">
import LoaderSvg from '~/components/LoaderSvg.vue'

// Redirect to houses page since that's our main page
await navigateTo('/houses')
</script>

<template>
  <div class="container">
    <div class="loading">
      <LoaderSvg />
    </div>
  </div>
</template>
