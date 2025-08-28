<script setup lang="ts">
import type { ApiHouse } from '~/types/api'
import LoaderSvg from '~/components/LoaderSvg.vue'
import HouseCard from '~/components/HouseCard.vue'
import HouseSearch from '~/components/HouseSearch.vue'
import HouseSort from '~/components/HouseSort.vue'

// SEO
useHead({
  title: 'Houses Overview - DTT Real Estate',
  meta: [{ name: 'description', content: 'Browse available houses and properties for sale.' }],
})

const { houses, loading, error, refresh } = useFetchHouses()

// Search state
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
  // Navigate to edit page
  navigateTo(`/houses/${houseId}/edit`)
}

const handleDelete = async (houseId: number) => {
  console.log('Delete house:', houseId)
  const confirmed = window.confirm('Are you sure you want to delete this listing?')
  if (!confirmed) return

  try {
    // Add your delete API call here
    // await $fetch(`/api/houses/${houseId}`, { method: 'DELETE' })

    // Refresh the list after successful delete
    refresh()
  } catch (error) {
    console.error('Failed to delete house:', error)
    alert('Failed to delete the listing. Please try again.')
  }
}
</script>

<template>
  <div class="houses-page">
    <div class="houses-page__header">
      <h1 class="houses-page__title">Houses</h1>
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
    <div v-if="loading" class="houses-page__state houses-page__state--loading">
      <LoaderSvg />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="houses-page__state houses-page__state--error">
      <p class="houses-page__error-message error-message">{{ error }}</p>
      <button class="houses-page__retry-btn btn btn-primary" @click="() => refresh()">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!filteredHouses || filteredHouses.length === 0"
      class="houses-page__state houses-page__state--empty"
    >
      <img src="/assets/img_empty_houses@3x.png" alt="No houses" class="houses-page__empty-image" />
      <p class="houses-page__empty-message empty-state-message">
        No results found.<br />Please try another keyword.
      </p>
    </div>

    <!-- Houses List -->
    <div v-else class="houses-page__grid">
      <NuxtLink
        v-for="house in filteredHouses"
        :key="house.id"
        :to="`/houses/${house.id}`"
        class="houses-page__house-link"
      >
        <HouseCard
          :house="house"
          :show-actions="true"
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.houses-page {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-md;

  @media (min-width: $breakpoint-lg) {
    padding: $spacing-lg $spacing-xl;
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

  &__house-link {
    text-decoration: none;
    color: inherit;
    display: block;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
