<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HouseList from '~/components/HouseList.vue'
import type { ApiHouse } from '~/types/api'

const FAVORITES_KEY = 'favoriteHouses'
const favorites = ref<ApiHouse[]>([])

function loadFavorites() {
  const saved = localStorage.getItem(FAVORITES_KEY)
  favorites.value = saved ? JSON.parse(saved) : []
}

onMounted(loadFavorites)

// Use a more specific type for the event payload
function handleFavoriteRemoved(id: number) {
  favorites.value = favorites.value.filter((h) => h.id !== id)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
}
</script>

<template>
  <div class="favorites-page">
    <h1>My Favorite Houses</h1>
    <HouseList
      :houses="favorites"
      empty-message="No favorites yet."
      :show-actions="true"
      @favorite-removed="handleFavoriteRemoved"
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
.favorites-page {
  max-width: $container-lg;
  margin: 0 auto;
  padding: 2rem;
}
.favorites-list__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.favorites-list__remove {
  background: none;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
