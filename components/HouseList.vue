<script setup lang="ts">
import HouseCard from '~/components/HouseCard.vue'
import LoaderSvg from '~/components/LoaderSvg.vue'
import type { ApiHouse } from '~/types/api'

defineProps<{
  houses: ApiHouse[]
  emptyMessage: string
  loading?: boolean
}>()

const emit = defineEmits(['list-removed', 'favorite-removed', 'history-removed', 'edit'])
</script>

<template>
  <div class="house-list">
    <LoaderSvg v-if="loading" class="house-list__loader" />
    <div v-else-if="!loading && houses.length === 0" class="house-list__empty">
      {{ emptyMessage }}
    </div>
    <div v-else>
      <div v-for="house in houses" :key="house.id" class="house-list__item">
        <HouseCard
          :house="house"
          @favorite-removed="emit('favorite-removed', $event)"
          @history-removed="emit('history-removed', $event)"
          @edit="emit('edit', house.id)"
          @delete="emit('list-removed', house.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.house-list {
  max-width: $container-lg;
  margin: 0 auto;

  &__loader {
    display: flex;
    justify-content: center;
    margin: $spacing-2xl 0;
    width: 100%;
  }

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
