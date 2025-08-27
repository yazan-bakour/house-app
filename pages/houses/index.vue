<script setup lang="ts">
import type { House, ApiHousesResponse } from '~/types/api'
import LoaderSvg from '~/components/LoaderSvg.vue'
import HouseCard from '~/components/HouseCard.vue'

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

// Watch for data changes and handle errors
// watch(error, (newError) => {
//   if (newError) {
//     console.error('Error fetching houses:', newError)
//   }
// })

// watch(housesResponse, (newData) => {
//   console.log('🏠 Houses response changed:', newData)
// })

// watch(houses, (newHouses) => {
//   console.log('🏘️ Transformed houses:', newHouses)
// })
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Houses</h1>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <LoaderSvg />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="btn btn-primary" @click="() => refresh()">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!houses || houses.length === 0" class="empty-container">
      <p class="empty-state-message">No houses available at the moment.</p>
    </div>

    <!-- Houses List -->
    <div v-else class="houses-grid">
      <HouseCard
        v-for="house in houses"
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.error-container {
  gap: $spacing-md;
}

.houses-grid {
  display: grid;
  gap: $spacing-lg;
  grid-template-columns: 1fr;

  // Responsive grid
  @media (min-width: $breakpoint-md) {
    gap: $spacing-xl;
  }

  @media (min-width: $breakpoint-lg) {
    gap: $spacing-lg;
  }
}
</style>
