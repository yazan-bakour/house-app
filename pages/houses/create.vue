<script setup lang="ts">
import HouseForm from '~/components/HouseForm.vue'
import type { CreatedId, CreateHouseRequest } from '~/types/api'

// SEO
useHead({
  title: 'Create new listing - DTT Real Estate',
  meta: [{ name: 'description', content: 'Create a new house listing with all the details.' }],
})

// Loading state
const loading = ref(false)

// Icons
const { useAppIcon } = useIcons()
const backIconGrey = useAppIcon('BACK_GREY')

async function handleSubmit(payload: {
  form: CreateHouseRequest
  imageFile: File | string | null
}) {
  // 1) Create
  const { id } = await $fetch<CreatedId>('/api/houses', {
    method: 'POST',
    body: payload.form,
  })

  // 2) Upload image (optional)
  if (payload.imageFile) {
    const fd = new FormData()
    fd.append('image', payload.imageFile)
    await $fetch(`/api/houses/${id}/upload`, {
      method: 'POST',
      body: fd,
    })
  }

  await navigateTo({ name: 'houses-id', params: { id } })
}
</script>

<template>
  <div class="create-house container">
    <!-- Desktop background -->
    <div class="create-house__background"></div>

    <div class="create-house__container">
      <!-- Back navigation -->
      <NuxtLink to="/houses" class="create-house__back create-house__back--desktop">
        <img class="create-house__back-icon" :src="backIconGrey" alt="Back" />
        <span class="create-house__back-text">Back to overview</span>
      </NuxtLink>

      <!-- Form container -->
      <div class="create-house__form-container">
        <div class="create-house__form-container--header">
          <NuxtLink to="/houses" class="create-house__back create-house__back--mobile">
            <img class="create-house__back-icon" :src="backIconGrey" alt="Back" />
          </NuxtLink>
          <h1 class="create-house__title">Create new listing</h1>
        </div>

        <HouseForm :loading="loading" @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-house {
  min-height: 100vh;
  position: relative;

  @media (min-width: $breakpoint-lg) {
    display: flex;
  }

  &__background {
    display: none;

    @media (min-width: $breakpoint-lg) {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-image: url('/assets/img_background@3x.png');
      background-size: cover;
      background-position: top center;
      background-repeat: no-repeat;
      z-index: 1;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba($background-2, 0.9);
      }
    }
  }

  &__container {
    padding: $spacing-lg;
    max-width: 500px;
    margin-bottom: 32px;

    @media (min-width: $breakpoint-lg) {
      padding: 0;
      position: relative;
      z-index: 1;
      max-width: 600px;
      margin-bottom: 48px;
    }
  }

  &__back {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    text-decoration: none;
    color: $text-primary;
    margin-bottom: $spacing-xl;
    transition: opacity $transition-fast ease;

    &--mobile {
      position: absolute;
      left: 0;
      top: 0;
      margin-bottom: $spacing-md;

      @media (min-width: $breakpoint-lg) {
        display: none;
      }
    }
    &--desktop {
      display: none;
      @media (min-width: $breakpoint-lg) {
        display: flex;
      }
    }

    &:hover {
      opacity: 0.7;
    }
  }

  &__back-icon {
    width: $icon-size-xs;
    height: $icon-size-xs;
    object-fit: contain;
  }

  &__back-text {
    font-family: $font-family-primary;
    font-weight: $font-weight-semibold;
    font-size: $font-size-back-button-label;
    color: $text-primary;
  }

  &__form-container {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;

    &--header {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: $spacing-lg;
      gap: $spacing-md;
      position: relative;

      @media (min-width: $breakpoint-lg) {
        justify-content: space-between;
      }
    }
  }

  &__title {
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-h1-mobile;
    color: $text-primary;
    margin: 0;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h1-desktop;
    }
  }
}
</style>
