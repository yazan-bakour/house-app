<script setup lang="ts">
import HouseCard from '~/components/HouseCard.vue'
import type { ApiHouse } from '~/types/api'

defineProps<{
  houses: ApiHouse[]
  emptyMessage: string
  showActions?: boolean
  disableHover?: boolean
  onFavoriteRemoved?: (id: number) => void
  onHistoryRemoved?: (id: number) => void
}>()
</script>

<template>
  <div class="house-list">
    <div v-if="houses.length === 0" class="house-list__empty">{{ emptyMessage }}</div>
    <div v-else>
      <div v-for="house in houses" :key="house.id" class="house-list__item">
        <HouseCard
          :house="house"
          :show-actions="showActions"
          :disable-hover="disableHover"
          @favorite-removed="onFavoriteRemoved && onFavoriteRemoved($event)"
          @history-removed="onHistoryRemoved && onHistoryRemoved($event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.house-list {
  max-width: $container-lg;
  margin: 0 auto;
  padding: 2rem;
  &__empty {
    color: $text-secondary;
    font-size: $font-size-body-desktop;
    text-align: center;
    margin-top: $spacing-2xl;
  }
  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
  }
}
</style>
