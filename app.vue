<script setup lang="ts">
const toast = useToast()
</script>
<template>
  <div class="app">
    <AppNavigation />
    <main class="main-content">
      <NuxtPage />
    </main>
    <HouseToaster
      :show="toast.show.value"
      :message="toast.message.value"
      :type="toast.type.value"
      :duration="toast.duration.value"
      @update:show="(value) => (toast.show.value = value)"
    />
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 0;
  padding-bottom: calc($nav-height + $spacing-lg);

  @media (min-width: $breakpoint-lg) {
    padding-top: calc($nav-height + $spacing-lg);
    padding-bottom: 0;
  }
}
</style>
