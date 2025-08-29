<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HouseList from '~/components/HouseList.vue'
import type { ApiHouse } from '~/types/api'

const HISTORY_KEY = 'viewedHouses'
const history = ref<ApiHouse[]>([])

function loadHistory() {
  const saved = localStorage.getItem(HISTORY_KEY)
  history.value = saved ? JSON.parse(saved) : []
}

onMounted(loadHistory)

function handleHistoryRemoved(id: number) {
  history.value = history.value.filter((h) => h.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
}
</script>

<template>
  <div class="history-page">
    <h1 class="history-page__title">Viewed Houses</h1>
    <HouseList
      :houses="history"
      empty-message="No history yet."
      :show-actions="false"
      :disable-hover="true"
      @history-removed="handleHistoryRemoved"
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
.history-page {
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
.history-list {
  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
  }
  &__remove {
    background: none;
    border: 1px solid $error-color;
    color: $error-color;
    padding: $spacing-sm $spacing-lg;
    border-radius: $border-radius-sm;
    cursor: pointer;
    font-family: $font-family-secondary;
    font-size: $font-size-body-mobile;
    transition: background $transition-fast;
    &:hover {
      background: rgba($error-color, 0.08);
    }
  }
}
</style>
