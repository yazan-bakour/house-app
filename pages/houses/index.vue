<script setup lang="ts">
import type { ApiHouse } from '~/types/api'
import LoaderSvg from '~/components/LoaderSvg.vue'
import HouseSearch from '~/components/HouseSearch.vue'
import HouseSort from '~/components/HouseSort.vue'
import DeleteDialog from '~/components/DeleteDialog.vue'
import { useDeleteDialog } from '~/composables/useDeleteDialog'
import type { FetchError } from 'ofetch'

const route = useRoute()
const toast = useToast()

// SEO
useHead({
  title: 'Houses Overview - DTT Real Estate',
  meta: [{ name: 'description', content: 'Browse available houses and properties for sale.' }],
})

const { houses, loading, error, refresh, housesInitialized } = useFetchHouses()
console.log('Houses fetched:', houses.value.length, loading.value)

// Search and filter state
const searchedHouses = ref<ApiHouse[]>([])
const filteredHouses = ref<ApiHouse[]>([])

// Initialize houses
onMounted(() => {
  searchedHouses.value = houses.value
  filteredHouses.value = houses.value
})

// Watch for houses changes
watch(houses, (newHouses) => {
  searchedHouses.value = newHouses
  filteredHouses.value = newHouses
})

// Handle search results
const handleSearch = (results: ApiHouse[]) => {
  searchedHouses.value = results
  // Let the sort component re-sort the new search results
}

// Event handlers
const handleEdit = (houseId: number) => {
  navigateTo(`/houses/edit/${houseId}`)
}

const {
  showDialog,
  loading: deleteLoading,
  openDialog,
  closeDialog,
  confirmDelete,
} = useDeleteDialog()

const handleDelete = (houseId: number) => {
  openDialog(houseId)
}

const handleDeleteConfirm = async () => {
  try {
    await confirmDelete(async () => {
      // Custom success logic per component
      if (route.name === 'houses-id') {
        await navigateTo('/houses')
      } else {
        await refresh()
      }
    })

    // Show success message after successful deletion
    toast.showApiSuccess({
      message: 'House deleted successfully',
      duration: 3000,
    })
  } catch (deleteError: unknown) {
    const fetchError = deleteError as FetchError
    const errorMessage =
      fetchError?.data?.message ||
      fetchError?.message ||
      'Failed to delete the house. Please try again.'
    toast.showApiError({
      message: errorMessage,
      duration: 3000,
    })
  }
}

// Handle retry with toast feedback
const handleRetry = async () => {
  try {
    await refresh()
    if (!error.value) {
      toast.showApiSuccess({
        message: 'Houses loaded successfully',
        duration: 2000,
      })
    }
  } catch (retryError: unknown) {
    const errorTyped = retryError as FetchError
    toast.showApiError({
      message: 'Failed to reload houses',
      error: errorTyped,
      duration: 5000,
    })
  }
}
</script>

<template>
  <div class="houses-page">
    <div class="houses-page__header">
      <h1 class="houses-page__title">Houses</h1>
      <NuxtLink to="/houses/create" class="btn houses-page__create-btn-mobile">
        <img src="/public/assets/ic_plus_grey@3x.png" alt="Plus" class="houses-page__icon" />
      </NuxtLink>
      <NuxtLink to="/houses/create" class="btn btn-primary houses-page__create-btn">
        <img src="/public/assets/ic_plus_white@3x.png" alt="Plus" class="houses-page__icon" />
        <span class="btn__text">Create new</span>
      </NuxtLink>
    </div>

    <div class="houses-page__controls">
      <HouseSearch
        v-if="!loading && !error && houses.length > 0"
        :houses="houses"
        class="houses-page__search"
        @search="handleSearch"
      />

      <HouseSort
        v-if="!loading && !error && houses.length > 0"
        :houses="searchedHouses"
        class="houses-page__sort"
        @sort="(sorted) => (filteredHouses = sorted)"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="loading || (!error && !housesInitialized)"
      class="houses-page__state houses-page__state--loading"
    >
      <LoaderSvg />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="houses-page__state houses-page__state--error">
      <p class="houses-page__error-message error-message">{{ error }}</p>
      <button class="houses-page__retry-btn btn btn-primary" @click="handleRetry">Try Again</button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="houses.length > 0 && filteredHouses.length === 0"
      class="houses-page__state houses-page__state--empty"
    >
      <img
        src="/public/assets/img_empty_houses@3x.png"
        alt="No houses"
        class="houses-page__empty-image"
      />
      <p class="houses-page__empty-message empty-state-message">
        No results found.<br />Please try different search or filter criteria.
      </p>
    </div>

    <!-- Houses List -->
    <div v-else class="houses-page__grid">
      <HouseList
        :houses="filteredHouses"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Delete Dialog -->
    <DeleteDialog
      :show="showDialog"
      :loading="deleteLoading"
      @confirm="handleDeleteConfirm"
      @cancel="closeDialog"
    />
  </div>
</template>

<style scoped lang="scss">
.houses-page {
  height: 100%;
  max-width: $container-lg;
  margin: 0 auto;
  padding: $spacing-md;

  @media (min-width: $breakpoint-lg) {
    padding: $spacing-lg $spacing-xl;
  }

  &__create-btn-mobile {
    display: flex;
    position: absolute;
    right: 10px;
    @media (min-width: $breakpoint-lg) {
      display: none;
    }
  }

  &__create-btn {
    display: none;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-lg;

    @media (min-width: $breakpoint-lg) {
      display: flex;
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
    margin-right: $spacing-xs;

    @media (min-width: $breakpoint-lg) {
      width: 18px;
      height: 18px;
      margin-right: $spacing-sm;
    }
  }

  &__header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: $spacing-lg;
    gap: $spacing-md;
    @media (min-width: $breakpoint-lg) {
      justify-content: space-between;
    }
  }

  &__title {
    margin: 0;
    font-size: $font-size-h1-mobile;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    color: $text-primary;
    line-height: 1.2;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h1-desktop;
    }
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    @media (min-width: $breakpoint-lg) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-lg;
      margin-bottom: $spacing-xl;
    }
  }

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;

    &--error {
      gap: $spacing-md;
    }

    &--empty {
      gap: $spacing-md;
    }
  }

  &__error-message {
    margin: 0;
  }

  &__empty-image {
    width: 200px;
    height: auto;

    @media (min-width: $breakpoint-lg) {
      width: 400px;
    }
  }

  &__empty-message {
    margin: 0;
    font-family: $font-family-primary;
    font-size: $font-size-body-mobile;
    color: $text-secondary;
    line-height: 1.4;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  &__grid {
    display: grid;
    gap: $spacing-lg;
    grid-template-columns: 1fr;

    @media (min-width: $breakpoint-md) {
      gap: $spacing-xl;
    }

    @media (min-width: $breakpoint-lg) {
      gap: $spacing-lg;
    }
  }

  /* Each house item is part of the grid with no additional styling needed */
}
</style>
