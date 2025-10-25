<script setup lang="ts">
import HouseList from '~/components/HouseList.vue'
import { useFavorites } from '~/composables/useFavorites'

useHead({
  title: 'Favorite listing - YBK Real Estate',
  meta: [{ name: 'description', content: 'View and remove your house listing.' }],
})
const favoritesStore = useFavorites()

function handleFavoriteRemoved(id: number) {
  favoritesStore.remove(id)
}
</script>

<template>
  <div class="favorites-page">
    <div class="favorites-page__header">
      <h1 class="favorites-page__title">My Favorite Houses</h1>
      <div v-if="favoritesStore.count.value > 0" class="favorites-page__count">
        {{ favoritesStore.count.value }}
        {{ favoritesStore.count.value === 1 ? 'favorite' : 'favorites' }}
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="favoritesStore.favorites.value.length === 0"
      class="favorites-page__state favorites-page__state--empty"
    >
      <EmptyState />
      <p class="favorites-page__empty-message empty-state-message">
        No favorites yet.<br>Start exploring houses to add them to your favorites!
      </p>
      <NuxtLink to="/houses" class="btn btn-primary favorites-page__browse-btn">
        Browse Houses
      </NuxtLink>
    </div>

    <!-- Favorites List -->
    <div v-else class="favorites-page__grid">
      <HouseList
        :houses="favoritesStore.favorites.value"
        @favorite-removed="handleFavoriteRemoved"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.favorites-page {
  max-width: $container-lg;
  margin: 0 auto;
  padding: $spacing-xl;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xl;
    flex-wrap: wrap;
    gap: $spacing-md;
  }

  &__title {
    font-size: $font-size-h1-mobile;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h1-desktop;
    }
  }

  &__count {
    background: $background-2;
    color: $text-primary;
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-body-mobile;
    font-weight: $font-weight-medium;
    font-family: $font-family-primary;
  }
  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;

    &--empty {
      gap: $spacing-md;
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

  &__browse-btn {
    margin-top: $spacing-md;
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

:deep(.house-card) {
  width: 100%;
  .house-card__action--favorite,
  .house-card__action--edit,
  .house-card__action--delete {
    display: none;
  }
}
</style>
