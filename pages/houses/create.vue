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
  <div class="create-house create-house__background">
    <div class="create-house__container">
      <!-- Back navigation -->
      <BackToOverview />

      <!-- Form container -->
      <div class="create-house__form-container">
        <div class="create-house__form-container--header">
          <NuxtLink to="/houses" class="create-house__back create-house__back--mobile">
            <img
              class="create-house__back-icon"
              src="/public/assets/ic_back_grey@3x.png"
              alt="Back"
            />
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
    background-image: url('/assets/img_background@3x.png');
    background-size: cover;
  }

  &__container {
    width: 100%;
    max-width: $container-lg;
    padding: $spacing-lg;
    margin: auto;

    @media (min-width: $breakpoint-lg) {
      padding: 0 $spacing-2xl;
      position: relative;
      z-index: 1;
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
