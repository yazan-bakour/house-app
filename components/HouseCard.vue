<script setup lang="ts">
import type { ApiHouse } from '~/types/api'

interface Props {
  house: ApiHouse
  showActions?: boolean
  loading?: boolean
}

interface Emits {
  edit: [id: number]
  delete: [id: number]
  click: [house: ApiHouse]
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

const emit = defineEmits<Emits>()

// Use icons composable for better performance and caching
const { useAppIcon, useHouseIcon } = useIcons()

// Load icons reactively
const editIcon = useAppIcon('EDIT')
const deleteIcon = useAppIcon('DELETE')
const bedIcon = useHouseIcon('BED')
const bathIcon = useHouseIcon('BATH')
const sizeIcon = useHouseIcon('SIZE')

// Computed properties for better reactivity and performance
const fullAddress = computed(() => {
  const { location } = props.house
  const baseAddress = `${location.street} ${location.houseNumber}`
  return location.houseNumberAddition
    ? `${baseAddress}${location.houseNumberAddition}`
    : baseAddress
})

const formattedPrice = computed(() => {
  return props.house.price.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
})

const fullLocation = computed(() => {
  return `${props.house.location.zip} ${props.house.location.city}`
})

const srcLabel = computed(() => {
  return `House at ${fullAddress.value}`
})

const hasValidId = computed(() => {
  return props.house.id != null && props.house.id > 0
})

// Event handlers with proper typing and error handling
const handleEdit = (e: Event) => {
  e.stopPropagation()
  if (!hasValidId.value) {
    console.warn('Cannot edit house: invalid ID')
    return
  }
  emit('edit', props.house.id!)
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  if (!hasValidId.value) {
    console.warn('Cannot delete house: invalid ID')
    return
  }
  emit('delete', props.house.id!)
}

const handleCardClick = () => {
  emit('click', props.house)
}
</script>

<template>
  <article class="house-card" :class="{ 'house-card--loading': loading }" @click="handleCardClick">
    <!-- House Image -->
    <div class="house-card__image-wrapper">
      <img v-if="!loading" :src="house.image" :alt="srcLabel" class="house-card__image" />
      <div v-else class="house-card__skeleton" aria-label="Loading image" />
    </div>

    <!-- House Details -->
    <div class="house-card__details">
      <div class="house-card__header">
        <h2 class="house-card__title">{{ fullAddress }}</h2>
        <div class="house-card__actions">
          <button
            class="house-card__action house-card__action--edit"
            aria-label="Edit house"
            @click="handleEdit"
          >
            <SmartImage :src="editIcon" label="Edit" :height="20" :width="20" />
          </button>
          <button
            class="house-card__action house-card__action--delete"
            aria-label="Delete house"
            @click="handleDelete"
          >
            <SmartImage :src="deleteIcon" label="Delete" :height="20" :width="20" />
          </button>
        </div>
      </div>

      <p class="house-card__price">{{ formattedPrice }}</p>
      <p class="house-card__location">{{ fullLocation }}</p>

      <div class="house-card__features">
        <div class="house-card__feature">
          <div v-if="!bedIcon" class="house-card__skeleton house-card__skeleton--icon" />
          <img v-else :src="bedIcon" alt="Bedrooms" class="house-card__feature-icon" />
          <span class="house-card__feature-text listing-info">{{ house.rooms.bedrooms }}</span>
        </div>
        <div class="house-card__feature">
          <img :src="bathIcon" alt="Bathrooms" class="house-card__feature-icon" />
          <span class="house-card__feature-text listing-info">{{ house.rooms.bathrooms }}</span>
        </div>
        <div class="house-card__feature">
          <div v-if="!sizeIcon" class="house-card__skeleton house-card__skeleton--icon" />
          <img v-else :src="sizeIcon" alt="Size" class="house-card__feature-icon" />
          <span class="house-card__feature-text listing-info">{{ house.size }} m²</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.house-card {
  background: $background-2;
  border-radius: $border-radius-md;
  box-shadow: $shadow-sm;
  overflow: hidden;
  transition: box-shadow $transition-normal ease;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: stretch;

  &:hover {
    box-shadow: $shadow-md;
  }

  &--loading {
    opacity: 0.7;
    pointer-events: none;
  }

  &__image-wrapper {
    width: 120px;
    height: 120px;
    overflow: hidden;
    flex-shrink: 0;
    padding: $spacing-md $spacing-sm;

    @media (min-width: $breakpoint-lg) {
      width: 200px;
      height: 200px;
      padding: $spacing-md;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $border-radius-sm;
  }

  &__skeleton {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      $tertiary-color 25%,
      $tertiary-color-2 50%,
      $tertiary-color 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: $border-radius-sm;

    &--icon {
      width: 18px;
      height: 18px;
      border-radius: $border-radius-sm;
    }
  }

  &__details {
    padding: $spacing-md $spacing-md $spacing-md $spacing-sm;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: $breakpoint-lg) {
      padding: $spacing-xl $spacing-lg $spacing-xl $spacing-sm;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $spacing-sm;
    margin-bottom: $spacing-xs;
  }

  &__title {
    margin: 0;
    font-size: $font-size-h2-mobile;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    color: $text-primary;
    line-height: 1.2;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h2-desktop;
    }
  }

  &__actions {
    display: flex;
    gap: $spacing-md;
    flex-shrink: 0;

    @media (min-width: $breakpoint-lg) {
      display: none;
    }
  }

  // Show actions on hover for desktop
  @media (min-width: $breakpoint-lg) {
    &:hover &__actions {
      display: flex;
    }
  }

  &__action {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    transition: opacity $transition-fast ease;

    &:hover {
      opacity: 0.7;
    }
  }

  &__price {
    margin: 0;
    font-size: $font-size-h2-mobile;
    font-family: $font-family-primary;
    font-weight: $font-weight-semibold;
    color: $text-secondary;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h2-desktop;
    }
  }

  &__location {
    margin: $spacing-xs 0;
    color: $text-secondary;
    font-size: $font-size-body-mobile;
    font-family: $font-family-secondary;
    font-weight: $font-weight-regular;
    opacity: 0.75;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-listing-info-desktop;
    }
  }

  &__features {
    display: flex;
    gap: $spacing-md;
    align-items: center;
    margin-top: auto;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    position: relative;
    line-height: 0;
  }

  &__feature-icon {
    width: 14px;
    height: auto;
    flex-shrink: 0;

    @media (min-width: $breakpoint-lg) {
      width: 18px;
    }
  }

  &__feature-text {
    color: $text-secondary;
    font-family: $font-family-secondary;
    opacity: 0.75;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
