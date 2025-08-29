<script setup lang="ts">
import type { ApiHouse } from '~/types/api'

interface Props {
  houses: ApiHouse[]
}

interface Emits {
  sort: [sortedHouses: ApiHouse[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Sorting state
const sortBy = ref<'price' | 'size'>('price')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Sort houses function
const sortHouses = () => {
  const sorted = [...props.houses].sort((a, b) => {
    let comparison = 0

    if (sortBy.value === 'price') {
      comparison = a.price - b.price
    } else if (sortBy.value === 'size') {
      comparison = a.size - b.size
    }

    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  emit('sort', sorted)
}

// Handle sort button clicks
const handleSortByPrice = () => {
  if (sortBy.value === 'price') {
    // Toggle order if already sorting by price
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Switch to price sorting
    sortBy.value = 'price'
    sortOrder.value = 'asc'
  }
  sortHouses()
}

const handleSortBySize = () => {
  if (sortBy.value === 'size') {
    // Toggle order if already sorting by size
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Switch to size sorting
    sortBy.value = 'size'
    sortOrder.value = 'asc'
  }
  sortHouses()
}

// Initial sort
onMounted(() => {
  sortHouses()
})

// Watch for houses changes
watch(
  () => props.houses,
  () => {
    sortHouses()
  },
  { deep: true }
)
</script>

<template>
  <div class="house-sort">
    <button
      class="house-sort__button"
      :class="{ 'house-sort__button--active': sortBy === 'price' }"
      @click="handleSortByPrice"
    >
      <span class="house-sort__label">Price</span>
    </button>
    <button
      class="house-sort__button"
      :class="{ 'house-sort__button--active': sortBy === 'size' }"
      @click="handleSortBySize"
    >
      <span class="house-sort__label">Size</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.house-sort {
  display: flex;
  gap: 0;
  border-top-right-radius: $border-radius-md;
  border-top-left-radius: $border-radius-md;
  border-bottom-left-radius: $border-radius-md;
  border-bottom-right-radius: $border-radius-md;
  overflow: hidden;
  margin-bottom: $spacing-lg;
  width: 100%;

  @media (min-width: $breakpoint-lg) {
    width: auto;
    margin-bottom: $spacing-xl;
  }

  &__button {
    flex: 1;
    padding: $spacing-md $spacing-lg;
    background: $tertiary-color-2;
    font-family: $font-family-primary;
    font-weight: $font-weight-semibold;
    font-size: $font-size-button-mobile;
    color: $background-2;
    transition: all $transition-fast ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    position: relative;

    @media (min-width: $breakpoint-lg) {
      flex: initial;
      min-width: 150px;
      padding: $spacing-1sm $spacing-xl;
      font-size: $font-size-button-desktop;
    }

    &:first-child {
      border-right: 1px solid rgba($background-2, 0.1);
    }

    &:hover:not(&--active) {
      background: $secondary-color-dark;
    }

    &--active {
      background: $primary-color;
      color: $background-2;
      font-weight: $font-weight-bold;
    }
  }

  &__label {
    display: inline-block;
  }
}
</style>
