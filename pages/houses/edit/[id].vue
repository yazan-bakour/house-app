<script setup lang="ts">
import HouseForm from '~/components/HouseForm.vue'
import { computed } from 'vue'
import { useRoute } from '#app'
import type { CreateHouseRequest, ApiHouse } from '~/types/api'
import { ofetch, type FetchError } from 'ofetch'

const route = useRoute()
const toast = useToast()
const id = computed(() => Number(route.params.id))
// SEO
useHead({
  title: 'Edit listing - DTT Real Estate',
  meta: [{ name: 'description', content: 'Edit your house listing details.' }],
})

// Fetch house data
const {
  data: house,
  pending: fetchLoading,
  error,
} = await useFetch<ApiHouse[]>(`/api/houses/${id.value}`, {
  key: `house-edit-${id.value}`,
})

// Form loading state
const submitLoading = ref(false)

// Handle form submission
const handleSubmit = async (payload: {
  form: CreateHouseRequest
  imageFile: File | string | null
}) => {
  submitLoading.value = true

  try {
    // Update the house
    await ofetch(`/api/houses/${id.value}`, {
      method: 'POST',
      body: payload.form,
    })
    //upload image if provided
    if (payload.imageFile) {
      const fd = new FormData()
      fd.append('image', payload.imageFile)
      await $fetch(`/api/houses/${id.value}/upload`, {
        method: 'POST',
        body: fd,
      })
    }

    toast.showApiSuccess({
      message: 'House updated successfully',
      duration: 3000,
    })

    // Navigate back to the house details
    await navigateTo(`/houses/${id.value}`)
  } catch (error: unknown) {
    const fetchError = error as FetchError

    // Show error message
    const errorMessage =
      fetchError?.data?.message ||
      fetchError?.message ||
      'Failed to update the listing. Please try again.'
    toast.showApiError({
      message: errorMessage,
      duration: 3000,
    })
  } finally {
    submitLoading.value = false
  }
}

// Loading state for the form
const isLoading = computed(() => fetchLoading.value || submitLoading.value)
</script>

<template>
  <div class="edit-house edit-house__background">
    <div class="edit-house__container">
      <!-- Back navigation -->
      <BackToOverview />

      <!-- Loading State -->
      <div v-if="isLoading">
        <LoaderSvg class="edit-house__loading" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="edit-house__error">
        <p class="edit-house__error-text">Failed to load house details.</p>
        <NuxtLink to="/houses" class="edit-house__error-link">Back to houses</NuxtLink>
      </div>

      <!-- Form container -->
      <div v-else-if="house" class="edit-house__form-container">
        <div class="edit-house__form-container--header">
          <NuxtLink to="/houses" class="edit-house__back edit-house__back--mobile">
            <img
              class="edit-house__back-icon"
              src="/public/assets/ic_back_grey@3x.png"
              alt="Back"
            />
          </NuxtLink>
          <h1 class="edit-house__title">Edit listing</h1>
        </div>

        <HouseForm
          buttonText="Save"
          :house="house"
          :loading="submitLoading"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-house {
  min-height: 100vh;
  position: relative;

  @media (min-width: $breakpoint-lg) {
    display: flex;
  }

  &__background {
    background-image: url('/public/assets/img_background@3x.png');
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
      padding: 0;

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

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  &__loading-text {
    font-family: $font-family-primary;
    font-size: $font-size-body-desktop;
    color: $text-secondary;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    min-height: 200px;
    justify-content: center;
  }

  &__error-text {
    font-family: $font-family-primary;
    font-size: $font-size-body-desktop;
    color: $error-color;
    margin: 0;
  }

  &__error-link {
    color: $text-link;
    text-decoration: underline;
    font-family: $font-family-secondary;
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
