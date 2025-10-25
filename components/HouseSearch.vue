<script setup lang="ts">
import type { ApiHouse } from '~/types/api'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  houses: ApiHouse[]
}

interface Emits {
  search: [results: ApiHouse[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Search state
const searchQuery = ref('')
const searchResults = ref<ApiHouse[]>(props.houses)
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
    // Search in multiple properties using ApiHouse structure
    const searchableFields = [
      house.location.street,
      house.location.houseNumber.toString(),
      house.location.houseNumberAddition,
      house.location.city,
      house.location.zip,
      house.price.toString(),
      house.size.toString(),
      house.rooms.bedrooms.toString(),
      house.rooms.bathrooms.toString(),
      house.description,
    ].filter(Boolean) // Remove undefined/null values

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
        <img
          src="/public/assets/ic_search@3x.png"
          alt="Search"
          class="house-search__icon house-search__icon--search"
        />
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
          <img
            src="/public/assets/ic_clear@3x.png"
            alt="Clear"
            class="house-search__icon house-search__icon--clear"
          />
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
    padding: 0 $spacing-md;
    height: 40px;

    @media (min-width: $breakpoint-lg) {
      height: 48px;
      padding: 0 $spacing-lg;
      width: 420px;
    }
  }

  &__icon {
    width: $icon-size-xs;
    height: $icon-size-xs;
    flex-shrink: 0;

    @media (min-width: $breakpoint-lg) {
      width: $icon-size-1sm;
      height: $icon-size-1sm;
    }

    &--search {
      margin-right: $spacing-sm;
      opacity: 0.5;
    }

    &--clear {
      width: $icon-size-2xs;
      height: $icon-size-2xs;

      @media (min-width: $breakpoint-lg) {
        width: $icon-size-1xs;
        height: $icon-size-1xs;
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
