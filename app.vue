<template>
  <div class="app">
    <AppNavigation />
    <main class="main-content">
      <NuxtPage />
    </main>
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
