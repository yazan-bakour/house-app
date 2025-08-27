<script setup lang="ts">
import LoaderSvg from '~/components/LoaderSvg.vue'

const loading = false
</script>

<template>
  <div class="container">
    <h1>House Management App</h1>
    <p>Welcome to the House Management System built with Nuxt 4, TypeScript, and Pinia!</p>

    <div class="actions">
      <NuxtLink to="/houses" class="btn">View All Houses</NuxtLink>
    </div>

    <div v-if="loading" class="loading">
      <LoaderSvg />
    </div>
  </div>
</template>
