<script setup lang="ts">
import type { House, ApiHousesResponse } from '~/types/api'
import LoaderSvg from '~/components/LoaderSvg.vue'
import HouseCard from '~/components/HouseCard.vue'
import HouseSearch from '~/components/HouseSearch.vue'

// SEO
useHead({
  title: 'Houses Overview - DTT Real Estate',
  meta: [{ name: 'description', content: 'Browse available houses and properties for sale.' }],
})

// API composable for fetching houses - using Nuxt's data fetching
const {
  data: housesResponse,
  error,
  pending: loading,
  refresh,
} = await useFetch<ApiHousesResponse>('/api/houses', {
  key: 'houses-list',
})

// Transform API response to match our interface
const houses = computed<House[]>(() => {
  if (!housesResponse.value?.value) {
    console.log('❌ No housesResponse.value.value found:')
    return []
  }

  const transformed = housesResponse.value.value.map((house) => ({
    id: house.id,
    price: house.price,
    bedrooms: house.rooms.bedrooms,
    bathrooms: house.rooms.bathrooms,
    size: house.size,
    streetName: house.location.street,
    houseNumber: String(house.location.houseNumber),
    numberAddition: house.location.houseNumberAddition || undefined,
    zip: house.location.zip,
    city: house.location.city,
    constructionYear: house.constructionYear,
    hasGarage: house.hasGarage,
    description: house.description,
    image: house.image,
    createdAt: house.createdAt,
    madeByMe: house.madeByMe,
  }))

  console.log('✅ Transformed houses:', transformed.length)
  return transformed
})

// Search state
const filteredHouses = ref<House[]>([])

// Initialize filtered houses
onMounted(() => {
  filteredHouses.value = houses.value
})

// Watch for houses changes
watch(houses, (newHouses) => {
  filteredHouses.value = newHouses
})

// Handle search results
const handleSearch = (results: House[]) => {
  filteredHouses.value = results
}

// Event handlers
const handleEdit = (houseId: number) => {
  // Navigate to edit page
  navigateTo(`/houses/${houseId}/edit`)
}

const handleDelete = (houseId: number) => {
  console.log('Delete house:', houseId)
  // Show confirmation dialog and handle deletion
  // This could be expanded with a modal/confirmation component
}

const handleHouseClick = (house: House) => {
  // Navigate to house details page
  if (house.id) {
    navigateTo(`/houses/${house.id}`)
  }
}
</script>

<template>
  <div class="houses-page">
    <div class="houses-page__header">
      <h1 class="houses-page__title">Houses</h1>
    </div>

    <!-- Search Component -->
    <HouseSearch
      v-if="!loading && !error && houses.length > 0"
      :houses="houses"
      class="houses-page__search"
      @search="handleSearch"
    />

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
      <HouseCard
        v-for="house in filteredHouses"
        :key="house.id"
        :house="house"
        :show-actions="true"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
        @click="handleHouseClick"
      />
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

  &__search {
    // Search component spacing handled by component itself
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

    &--loading {
      // Loading specific styles if needed
    }
  }

  &__error-message {
    margin: 0;
    // Inherits styles from global .error-message class
  }

  &__retry-btn {
    // Inherits styles from global .btn class
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
}
</style>
