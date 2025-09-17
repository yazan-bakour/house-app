<script setup lang="ts">
import type { FilterOptions } from '~/composables/useFilter'
import type { ApiHouse } from '~/types/api'

interface Props {
  houses: ApiHouse[]
  pendingFilters: FilterOptions
}

interface Emits {
  'update:pendingFilters': [filters: FilterOptions]
  applyFilters: []
  reset: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showAdvanced = ref(false)

// Get unique values for dropdowns
const uniqueCities = computed(() => {
  const cities = props.houses.map((house) => house.location.city)
  return [...new Set(cities)].sort()
})

const bedroomOptions = computed(() => {
  const bedrooms = props.houses.map((house) => house.rooms.bedrooms)
  return [...new Set(bedrooms)].sort((a, b) => a - b)
})

const bathroomOptions = computed(() => {
  const bathrooms = props.houses.map((house) => house.rooms.bathrooms)
  return [...new Set(bathrooms)].sort((a, b) => a - b)
})

// Update pending filter values
const updatePendingFilter = (key: keyof FilterOptions, value: string | number | undefined) => {
  if (value === '' || value === null || value === undefined) {
    // Remove the key by destructuring and omitting it
    const { [key]: _, ...newFilters } = props.pendingFilters
    emit('update:pendingFilters', newFilters)
  } else {
    // Add or update the key
    const newFilters = {
      ...props.pendingFilters,
      [key]: value as FilterOptions[typeof key],
    }
    emit('update:pendingFilters', newFilters)
  }
}

const applyFilters = () => {
  emit('applyFilters')
}

const resetFilters = () => {
  emit('reset')
}

const hasActiveFilters = computed(() => {
  return Object.keys(props.pendingFilters).length > 0
})
</script>

<template>
  <div class="house-filter">
    <div class="house-filter__basic">
      <div class="house-filter__field">
        <label class="house-filter__label">City</label>
        <select
          class="house-filter__select"
          :value="pendingFilters.city || ''"
          @change="updatePendingFilter('city', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All cities</option>
          <option v-for="city in uniqueCities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>

      <div class="house-filter__field">
        <label class="house-filter__label">Price Range</label>
        <div class="house-filter__price-range">
          <input
            type="number"
            class="house-filter__input house-filter__input--small"
            placeholder="Min"
            min="0"
            step="1000"
            :value="pendingFilters.minPrice || ''"
            @input="
              updatePendingFilter(
                'minPrice',
                ($event.target as HTMLInputElement).value &&
                  !isNaN(Number(($event.target as HTMLInputElement).value))
                  ? Number(($event.target as HTMLInputElement).value)
                  : undefined
              )
            "
          />
          <span class="house-filter__separator">-</span>
          <input
            type="number"
            class="house-filter__input house-filter__input--small"
            placeholder="Max"
            min="0"
            step="1000"
            :value="pendingFilters.maxPrice || ''"
            @input="
              updatePendingFilter(
                'maxPrice',
                ($event.target as HTMLInputElement).value &&
                  !isNaN(Number(($event.target as HTMLInputElement).value))
                  ? Number(($event.target as HTMLInputElement).value)
                  : undefined
              )
            "
          />
        </div>
      </div>

      <div class="house-filter__actions">
        <button
          type="button"
          class="house-filter__toggle btn btn--outline btn--small"
          @click="showAdvanced = !showAdvanced"
        >
          {{ showAdvanced ? 'Less' : 'More' }} filters
        </button>

        <button
          type="button"
          class="house-filter__apply btn btn-primary btn--small"
          @click="applyFilters"
          :disabled="!hasActiveFilters"
        >
          Apply Filters
        </button>

        <button
          v-if="hasActiveFilters"
          type="button"
          class="house-filter__reset btn btn--outline btn--small"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
    </div>

    <div v-if="showAdvanced" class="house-filter__advanced">
      <div class="house-filter__field">
        <label class="house-filter__label">Bedrooms</label>
        <select
          class="house-filter__select"
          :value="pendingFilters.bedrooms || ''"
          @change="
            updatePendingFilter(
              'bedrooms',
              ($event.target as HTMLSelectElement).value
                ? Number(($event.target as HTMLSelectElement).value)
                : undefined
            )
          "
        >
          <option value="">Any</option>
          <option v-for="bedroom in bedroomOptions" :key="bedroom" :value="bedroom">
            {{ bedroom }}
          </option>
        </select>
      </div>

      <div class="house-filter__field">
        <label class="house-filter__label">Bathrooms</label>
        <select
          class="house-filter__select"
          :value="pendingFilters.bathrooms || ''"
          @change="
            updatePendingFilter(
              'bathrooms',
              ($event.target as HTMLSelectElement).value
                ? Number(($event.target as HTMLSelectElement).value)
                : undefined
            )
          "
        >
          <option value="">Any</option>
          <option v-for="bathroom in bathroomOptions" :key="bathroom" :value="bathroom">
            {{ bathroom }}
          </option>
        </select>
      </div>

      <div class="house-filter__field">
        <label class="house-filter__label">Size (m²)</label>
        <div class="house-filter__price-range">
          <input
            type="number"
            class="house-filter__input house-filter__input--small"
            placeholder="Min"
            min="0"
            step="10"
            :value="pendingFilters.minSize || ''"
            @input="
              updatePendingFilter(
                'minSize',
                ($event.target as HTMLInputElement).value &&
                  !isNaN(Number(($event.target as HTMLInputElement).value))
                  ? Number(($event.target as HTMLInputElement).value)
                  : undefined
              )
            "
          />
          <span class="house-filter__separator">-</span>
          <input
            type="number"
            class="house-filter__input house-filter__input--small"
            placeholder="Max"
            min="0"
            step="10"
            :value="pendingFilters.maxSize || ''"
            @input="
              updatePendingFilter(
                'maxSize',
                ($event.target as HTMLInputElement).value &&
                  !isNaN(Number(($event.target as HTMLInputElement).value))
                  ? Number(($event.target as HTMLInputElement).value)
                  : undefined
              )
            "
          />
        </div>
      </div>

      <div class="house-filter__field">
        <label class="house-filter__label">ZIP Code</label>
        <input
          type="text"
          class="house-filter__input"
          placeholder="Enter ZIP code"
          :value="pendingFilters.zip || ''"
          @input="updatePendingFilter('zip', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.house-filter {
  background: $background-2;
  border-radius: $border-radius-md;
  padding: $spacing-md;
  box-shadow: $shadow-sm;
  margin-bottom: $spacing-lg;

  @media (min-width: $breakpoint-lg) {
    padding: $spacing-lg;
  }

  &__basic,
  &__advanced {
    display: grid;
    gap: $spacing-md;
    grid-template-columns: 1fr;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  &__advanced {
    margin-top: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $tertiary-color;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__label {
    font-family: $font-family-primary;
    font-size: $font-size-input-title-mobile;
    font-weight: $font-weight-medium;
    color: $text-primary;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-input-title-desktop;
    }
  }

  &__input,
  &__select {
    padding: $spacing-sm $spacing-md;
    border: 1px solid $tertiary-color;
    border-radius: $border-radius-sm;
    font-family: $font-family-secondary;
    font-size: $font-size-input-field-mobile;
    background: $background-2;
    color: $text-primary;
    transition: border-color $transition-fast ease;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-input-field-desktop;
    }

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &--small {
      flex: 1;
    }
  }

  &__price-range {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__separator {
    color: $text-secondary;
    font-family: $font-family-secondary;
    font-size: $font-size-body-mobile;
  }

  &__actions {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    justify-content: flex-end;

    @media (max-width: $breakpoint-md) {
      grid-column: 1 / -1;
      justify-content: center;
    }
  }

  &__toggle,
  &__reset,
  &__apply {
    white-space: nowrap;
  }

  &__apply {
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

// Button styles
.btn {
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  font-family: $font-family-primary;
  font-size: $font-size-button-mobile;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-fast ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;

  @media (min-width: $breakpoint-lg) {
    font-size: $font-size-button-desktop;
  }

  &--outline {
    background: transparent;
    border: 1px solid $tertiary-color;
    color: $text-secondary;

    &:hover {
      border-color: $primary-color;
      color: $primary-color;
    }
  }

  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-body-mobile;
  }
}
</style>
