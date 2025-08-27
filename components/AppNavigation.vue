<script setup lang="ts">
const route = useRoute()
const { useNavigationIcon, useAppIcon, useIconPreloader } = useIcons()

// Reactive computed properties for active states
const isHousesActive = computed(() => route.path === '/' || route.path.startsWith('/houses'))
const isAboutActive = computed(() => route.path === '/about')

// Reactive icon URLs
const homeIcon = useNavigationIcon('home', isHousesActive)
const infoIcon = useNavigationIcon('info', isAboutActive)
const logo = useAppIcon('LOGO')

// Preload icons for better performance
useIconPreloader()
</script>

<template>
  <div>
    <!-- Desktop Navigation Header -->
    <header class="desktop-nav">
      <div class="nav-container">
        <div class="logo">
          <SmartImage :src="logo" label="DTT Logo" :height="40" :width="118" />
        </div>
        <nav class="nav-menu" aria-label="Main navigation">
          <NuxtLink to="/houses" class="nav-link" :class="{ active: isHousesActive }">
            Houses
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link" :class="{ active: isAboutActive }">
            About
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Mobile Navigation Bottom -->
    <nav class="mobile-nav" aria-label="Mobile navigation">
      <NuxtLink to="/houses" class="mobile-nav-item" :class="{ active: isHousesActive }">
        <SmartImage :src="homeIcon" label="Houses" :height="24" :width="26" />
      </NuxtLink>
      <NuxtLink to="/about" class="mobile-nav-item" :class="{ active: isAboutActive }">
        <SmartImage :src="infoIcon" label="About" :height="24" :width="26" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped lang="scss">
// Desktop Navigation
.desktop-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: $background-2;
  border-bottom: 1px solid $tertiary-color;
  box-shadow: $shadow-sm;
  z-index: $z-index-nav;
  height: $nav-height;
  display: none;

  @media (min-width: $breakpoint-lg) {
    display: block;
  }
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-xl;
  height: 100%;
  display: flex;
  align-items: center;
  gap: $spacing-2xl;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
}

.nav-link {
  text-decoration: none;
  color: $text-secondary;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  transition: color $transition-fast ease;
  white-space: nowrap;

  &:hover:not(.active) {
    color: $text-secondary;
    font-weight: $font-weight-medium;
  }

  &.active {
    color: $text-primary;
    font-weight: $font-weight-bold;
  }
}

// Mobile Navigation
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $background-2;
  border-top: 1px solid $tertiary-color;
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.05);
  z-index: $z-index-nav;
  height: $nav-height;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: $spacing-4xl;
  padding: 0 $spacing-lg;

  @media (min-width: $breakpoint-lg) {
    display: none;
  }
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md;
  text-decoration: none;
  border-radius: $border-radius-md;
  transition: background-color $transition-fast ease;

  &:hover {
    background-color: rgba($primary-color, $hover-opacity);
  }

  &:active {
    background-color: rgba($primary-color, 0.15);
  }
}
</style>
