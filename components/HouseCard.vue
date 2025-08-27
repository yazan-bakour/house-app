<script setup lang="ts">
import type { House } from '~/types/api'

interface Props {
  house: House
  showActions?: boolean
  loading?: boolean
}

interface Emits {
  edit: [houseId: number]
  delete: [houseId: number]
  click: [house: House]
}

const props = withDefaults(defineProps<Props>(), {
  showActions: false,
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
  const { streetName, houseNumber, numberAddition } = props.house
  const baseAddress = `${streetName} ${houseNumber}`
  return numberAddition ? `${baseAddress}${numberAddition}` : baseAddress
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
  return `${props.house.zip} ${props.house.city}`
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
  <article class="house-card" :class="{ 'is-loading': loading }" @click="handleCardClick">
    <!-- House Image -->
    <div class="house-image">
      <img v-if="!loading" :src="house.image" :alt="srcLabel" class="card-image" />
      <div v-else class="image-skeleton" aria-label="Loading image" />
    </div>

    <!-- House Details -->
    <div class="house-details">
      <div class="house-header">
        <h2 class="house-title">{{ fullAddress }}</h2>
        <div class="house-actions">
          <button class="action-btn edit-btn" aria-label="Edit house" @click="handleEdit">
            <SmartImage :src="editIcon" label="Edit" :height="20" :width="20" />
          </button>
          <button class="action-btn delete-btn" aria-label="Delete house" @click="handleDelete">
            <SmartImage :src="deleteIcon" label="Delete" :height="20" :width="20" />
          </button>
        </div>
      </div>

      <p class="house-price">{{ formattedPrice }}</p>
      <p class="house-location">{{ fullLocation }}</p>

      <div class="house-features">
        <div class="feature">
          <div v-if="!sizeIcon" class="image-skeleton" style="width: 18px; height: 18px" />
          <img v-else :src="bedIcon" alt="Bedrooms" class="feature-icon" />
          <span class="feature-text listing-info">{{ house.bedrooms }}</span>
        </div>
        <div class="feature">
          <img :src="bathIcon" alt="Bathrooms" class="feature-icon" />
          <span class="feature-text listing-info">{{ house.bathrooms }}</span>
        </div>
        <div class="feature">
          <div v-if="!sizeIcon" class="image-skeleton" style="width: 18px; height: 18px" />
          <img :src="sizeIcon" alt="Size" class="feature-icon" />
          <span class="feature-text listing-info">{{ house.size }} m²</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.house-card .house-actions {
  display: flex;
}

@media (min-width: $breakpoint-lg) {
  .house-card .house-actions {
    display: none;
  }

  .house-card:hover .house-actions {
    display: flex;
  }
}
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

  &.is-loading {
    opacity: 0.7;
    pointer-events: none;
  }
}

.house-image {
  width: 120px;
  height: 120px;
  overflow: hidden;
  flex-shrink: 0;
  padding: $spacing-md $spacing-sm;

  // Desktop - larger square image
  @media (min-width: $breakpoint-lg) {
    width: 200px;
    height: 200px;
    padding: $spacing-md;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .image-skeleton {
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

.house-details {
  padding: $spacing-md $spacing-md $spacing-md $spacing-sm;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: $breakpoint-lg) {
    padding: $spacing-xl $spacing-lg $spacing-xl $spacing-sm;
  }
}

.house-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-sm;
  margin-bottom: $spacing-xs;
}

.house-title {
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

.house-actions {
  gap: $spacing-md;
  flex-shrink: 0;
}

.action-btn {
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

.house-price {
  margin: 0;
  font-size: $font-size-h2-mobile;
  font-family: $font-family-primary;
  font-weight: $font-weight-semibold;
  color: $text-secondary;

  @media (min-width: $breakpoint-lg) {
    font-size: $font-size-h2-desktop;
  }
}

.house-location {
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

.house-features {
  display: flex;
  gap: $spacing-md;
  align-items: center;
  margin-top: auto;
}

.feature {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  position: relative;
  line-height: 0;
}

.feature-icon {
  width: 14px;
  height: auto;
  flex-shrink: 0;

  @media (min-width: $breakpoint-lg) {
    width: 18px;
  }
}

.feature-text {
  color: $text-secondary;
  font-family: $font-family-secondary;
  opacity: 0.75;
}
</style>
