<script setup lang="ts">
const route = useRoute()

// Reactive computed properties for active states
const isHousesActive = computed(() => route.path === '/houses' || route.path.startsWith('/houses'))
const isAboutActive = computed(() => route.path === '/about')
</script>

<template>
  <div class="app-navigation">
    <!-- Desktop Navigation Header -->
    <header class="app-navigation__desktop">
      <div class="app-navigation__container">
        <div class="app-navigation__logo">
          <img src="/public/assets/img_logo_dtt@3x.png" alt="DTT Logo" :height="40" :width="118" />
        </div>
        <nav class="app-navigation__menu" aria-label="Main navigation">
          <NuxtLink
            to="/houses"
            class="app-navigation__link"
            :class="{ 'app-navigation__link--active': isHousesActive }"
          >
            Houses
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="app-navigation__link"
            :class="{ 'app-navigation__link--active': isAboutActive }"
          >
            About
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Mobile Navigation Bottom -->
    <nav class="app-navigation__mobile" aria-label="Mobile navigation">
      <NuxtLink
        to="/houses"
        class="app-navigation__mobile-item"
        :class="{ 'app-navigation__mobile-item--active': isHousesActive }"
      >
        <div v-if="isHousesActive">
          <img
            src="/public/assets/ic_mobile_navigarion_home_active@3x.png"
            alt="Houses"
            :height="24"
            :width="26"
          />
        </div>
        <div v-else>
          <img
            src="/public/assets/ic_mobile_navigarion_home@3x.png"
            alt="Houses"
            :height="24"
            :width="26"
          />
        </div>
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="app-navigation__mobile-item"
        :class="{ 'app-navigation__mobile-item--active': isAboutActive }"
      >
        <div v-if="isAboutActive">
          <img
            src="/public/assets/ic_mobile_navigarion_info_active@3x.png"
            alt="Houses"
            :height="24"
            :width="26"
          />
        </div>
        <div v-else>
          <img
            src="/public/assets/ic_mobile_navigarion_info@3x.png"
            alt="Houses"
            :height="24"
            :width="26"
          />
        </div>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.app-navigation {
  // Desktop Navigation
  &__desktop {
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

  &__container {
    max-width: $container-lg;
    margin: 0 auto;
    padding: 0 $spacing-xl;
    height: 100%;
    display: flex;
    align-items: center;
    gap: $spacing-2xl;
  }

  &__logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  &__menu {
    display: flex;
    align-items: center;
    gap: $spacing-xl;
  }

  &__link {
    text-decoration: none;
    color: $text-secondary;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-sm;
    transition: color $transition-fast ease;
    white-space: nowrap;

    &:hover:not(&--active) {
      color: $text-secondary;
      font-weight: $font-weight-medium;
    }

    &--active {
      color: $text-primary;
      font-weight: $font-weight-bold;
    }
  }

  // Mobile Navigation
  &__mobile {
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

  &__mobile-item {
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
}
</style>
