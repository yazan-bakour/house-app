<script setup lang="ts">
import type { House } from '~/types/api'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  houses: House[]
}

interface Emits {
  search: [results: House[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Use icons composable
const { useAppIcon } = useIcons()
const searchIcon = useAppIcon('SEARCH')
const clearIcon = useAppIcon('CLEAR')

// Search state
const searchQuery = ref('')
const searchResults = ref<House[]>(props.houses)
const resultsCount = computed(() => searchResults.value.length)

// Search logic
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = props.houses
    emit('search', props.houses)
    return
  }

  const query = searchQuery.value.toLowerCase().trim()

  const filtered = props.houses.filter((house) => {
    // Search in multiple properties
    const searchableFields = [
      house.streetName,
      house.houseNumber,
      house.numberAddition,
      house.city,
      house.zip,
      house.price.toString(),
      house.size.toString(),
      house.bedrooms.toString(),
      house.bathrooms.toString(),
    ].filter(Boolean) // Remove undefined values

    // Check if any field contains the search query
    return searchableFields.some((field) => field?.toLowerCase().includes(query))
  })

  searchResults.value = filtered
  emit('search', filtered)
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = props.houses
  emit('search', props.houses)
}

// Watch for search query changes with debounce
const debouncedSearch = useDebounceFn(performSearch, 300)
watch(searchQuery, debouncedSearch)

// Watch for houses prop changes
watch(
  () => props.houses,
  (newHouses) => {
    if (!searchQuery.value.trim()) {
      searchResults.value = newHouses
    } else {
      performSearch()
    }
  }
)

// Initialize results
onMounted(() => {
  searchResults.value = props.houses
})
</script>

<template>
  <div class="house-search">
    <div class="house-search__container">
      <!-- Search Input -->
      <div class="house-search__input-wrapper">
        <img :src="searchIcon" alt="Search" class="house-search__icon house-search__icon--search" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for a house"
          class="house-search__input input-field"
          @input="performSearch"
        />
        <button
          v-if="searchQuery"
          class="house-search__close"
          aria-label="Clear search"
          @click="clearSearch"
        >
          <img :src="clearIcon" alt="Clear" class="house-search__icon house-search__icon--clear" />
        </button>
      </div>

      <!-- Results Count -->
      <div v-if="searchQuery" class="house-search__results">
        <p v-if="resultsCount > 0" class="house-search__label">
          {{ resultsCount }} {{ resultsCount === 1 ? 'result' : 'results' }} found
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.house-search {
  margin-bottom: $spacing-lg;

  @media (min-width: $breakpoint-lg) {
    margin-bottom: $spacing-xl;
  }

  &__container {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: $tertiary-color;
    border-radius: $border-radius-md;
    padding: 0 $spacing-md;
    height: 40px;

    @media (min-width: $breakpoint-lg) {
      height: 48px;
      padding: 0 $spacing-lg;
      width: 420px;
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;

    @media (min-width: $breakpoint-lg) {
      width: 20px;
      height: 20px;
    }

    &--search {
      margin-right: $spacing-sm;
      opacity: 0.5;
    }

    &--clear {
      width: 14px;
      height: 14px;

      @media (min-width: $breakpoint-lg) {
        width: 16px;
        height: 16px;
      }
    }
  }

  &__input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: $spacing-sm 0;
    color: $text-primary;

    &::placeholder {
      color: $text-secondary;
      opacity: 0.6;
    }

    &:focus {
      outline: none;
    }
  }

  &__close {
    background: transparent;
    border: none;
    padding: $spacing-xs;
    margin-left: $spacing-sm;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color $transition-fast ease;

    &:hover {
      background-color: rgba($secondary-color, 0.1);
    }
  }

  &__results {
    padding-left: $spacing-xs;
  }

  &__label {
    margin: 0;
    font-family: $font-family-primary;
    font-weight: $font-weight-semibold;
    font-size: $font-size-body-mobile;
    color: $text-primary;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }

    &--empty {
      color: $text-secondary;
      font-style: italic;
    }
  }
}
</style>
