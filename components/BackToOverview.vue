<script setup lang="ts">
defineProps<{ icon: string }>()
</script>

<template>
  <NuxtLink to="/houses" class="back-to-overview">
    <img class="back-to-overview__icon" :src="icon" alt="Back" />
    <span class="back-to-overview__text">Back to overview</span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.back-to-overview {
  display: none;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
  text-decoration: none;
  margin-bottom: $spacing-lg;

  @media (min-width: $breakpoint-lg) {
    display: flex;
  }

  &:hover .back-to-overview__text {
    text-decoration: none;
  }
  &__icon {
    width: $icon-size-xs;
    height: $icon-size-xs;
    object-fit: contain;
  }
  &__text {
    font-weight: $font-weight-semibold;
    font-size: $font-size-button-desktop;
    color: $text-primary;
  }
}
</style>
