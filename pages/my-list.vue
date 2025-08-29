<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HouseList from '~/components/HouseList.vue'
import type { ApiHouse } from '~/types/api'

const myHouses = ref<ApiHouse[]>([])

async function loadMyHouses() {
  // Fetch all houses from the API
  const response = await $fetch<ApiHouse[] | { value: ApiHouse[] }>('/api/houses')
  // Support both wrapped and direct array responses
  const houses: ApiHouse[] = Array.isArray(response)
    ? response
    : (response as { value?: ApiHouse[] }).value ?? []
  myHouses.value = houses.filter((h: ApiHouse) => h.madeByMe === true)
}

onMounted(loadMyHouses)
</script>

<template>
  <div class="my-list-page">
    <h1 class="my-list-page__title">My Listings</h1>
    <HouseList
      :houses="myHouses"
      empty-message="You have not created any listings yet."
      :show-actions="true"
      :disable-hover="true"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.house-card) {
  width: 100%;

  .house-card__action--favorite,
  .house-card__action--edit,
  .house-card__action--delete {
    display: none;
  }
}
.my-list-page {
  max-width: $container-lg;
  margin: 0 auto;
  padding: 2rem;

  &__title {
    font-size: $font-size-h1-mobile;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin-bottom: $spacing-xl;
    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h1-desktop;
    }
  }
  &__empty {
    color: $text-secondary;
    font-size: $font-size-body-desktop;
    text-align: center;
    margin-top: $spacing-2xl;
  }
}
.my-list {
  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
  }
}
</style>
