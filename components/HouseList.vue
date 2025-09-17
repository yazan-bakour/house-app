<script setup lang="ts">
import HouseCard from '~/components/HouseCard.vue'
import type { ApiHouse } from '~/types/api'

defineProps<{
  houses: ApiHouse[]
  loading?: boolean
}>()

const emit = defineEmits(['list-removed', 'favorite-removed', 'history-removed', 'edit'])
</script>

<template>
  <div v-for="house in houses" :key="house.id">
    <HouseCard
      :house="house"
      @favorite-removed="emit('favorite-removed', $event)"
      @history-removed="emit('history-removed', $event)"
      @edit="emit('edit', house.id)"
      @delete="emit('list-removed', house.id)"
      @click="() => navigateTo(`/houses/${house.id}`)"
    />
  </div>
</template>

<style scoped lang="scss">
.house-list {
  max-width: $container-lg;

  margin: 0 auto;
}
</style>
