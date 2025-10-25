<script setup lang="ts">
import HouseList from '~/components/HouseList.vue'

useHead({
  title: 'History listing - YBK Real Estate',
  meta: [{ name: 'description', content: 'View and remove your house history.' }],
})

const toast = useToast()
const historyStore = useHistory()

function handleHistoryRemoved(id: number) {
  historyStore.remove(id)
  toast.showApiSuccess({
    message: 'Removed from history',
  })
}
</script>

<template>
  <div class="history-page">
    <div class="history-page__header">
      <h1 class="history-page__title">Viewed Houses</h1>
      <div v-if="historyStore.count.value > 0" class="history-page__count">
        {{ historyStore.count.value }}
        {{ historyStore.count.value === 1 ? 'house' : 'houses' }} viewed
      </div>
    </div>

    <div class="history-page__grid">
      <HouseList
        :houses="historyStore.history.value"
        empty-message="No history yet."
        @history-removed="handleHistoryRemoved"
      />
    </div>
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
