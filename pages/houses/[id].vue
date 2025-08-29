<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'
import type { ApiHouse } from '~/types/api'

const route = useRoute()
const id = computed(() => Number(route.params.id))

// --- Fetch the house ---
const { data: house } = await useFetch<ApiHouse[]>(`/api/houses/${id.value}`, {
  key: `houses-details-${id.value}`,
})

const extractedHouse = computed(() => {
  return house.value?.find((el) => el.id === id.value) || null
})

const { houses, loading, refresh } = useFetchHouses()

const handleEdit = () => {
  navigateTo(`/houses/edit/${extractedHouse.value?.id}`)
}
const {
  showDialog,
  loading: deleteLoading,
  openDialog,
  closeDialog,
  confirmDelete,
} = useDeleteDialog()

const handleDelete = () => {
  if (!extractedHouse.value?.id) return
  openDialog(extractedHouse.value?.id)
}
const handleDeleteConfirm = async () => {
  await confirmDelete(async () => {
    await refresh()
    await navigateTo('/houses')
  })
}
</script>

<template>
  <div class="house-details">
    <BackToOverview />

    <div class="house-details__container">
      <div class="house-details__article">
        <div class="house-details__image-container">
          <img
            class="house-details__image"
            :src="extractedHouse?.image"
            :alt="`${extractedHouse?.location.street} ${extractedHouse?.location.houseNumber}`"
          />
          <!-- Edit/Delete Actions for desktop -->
          <div class="house-details__actions house-details__image-container--mobile">
            <button
              class="house-details__action-btn house-details__image-container--back"
              @click="navigateTo('/houses')"
            >
              <img src="/public/assets/ic_back_white@3x.png" alt="Back" />
            </button>
            <div class="house-details__image-container--bulks">
              <button
                class="house-details__action-btn house-details__image-container--edit"
                @click="handleEdit"
              >
                <img src="/public/assets//ic_edit_white@3x.png" alt="Edit" />
              </button>
              <button
                class="house-details__action-btn house-details__image-container--delete"
                @click="handleDelete"
              >
                <img src="/public/assets/ic_delete_white@3x.png" alt="Delete" />
              </button>
            </div>
            <DeleteDialog
              :show="showDialog"
              :loading="deleteLoading"
              @confirm="handleDeleteConfirm"
              @cancel="closeDialog"
            />
          </div>
        </div>
        <div class="house-details__info-card">
          <!-- Title and Actions -->
          <div class="house-details__header">
            <h1 class="house-details__title">
              {{ extractedHouse?.location.street }} {{ extractedHouse?.location.houseNumber
              }}<template v-if="extractedHouse?.location.houseNumberAddition">{{
                extractedHouse?.location.houseNumberAddition
              }}</template>
            </h1>

            <!-- Edit/Delete Actions for mobile -->
            <div class="house-details__actions house-details__info-card--desktop">
              <button
                v-if="extractedHouse?.madeByMe"
                class="house-details__action-btn house-details__info-card--edit"
                @click="handleEdit"
              >
                <img src="/public/assets/ic_edit@3x.png" alt="Edit" />
              </button>
              <button
                v-if="extractedHouse?.madeByMe"
                class="house-details__action-btn house-details__info-card--delete"
                @click="handleDelete"
              >
                <img src="/public/assets/ic_delete@3x.png" alt="Delete" />
              </button>
            </div>
          </div>

          <!-- Location -->
          <div class="house-details__location">
            <img
              class="house-details__icon"
              src="/public/assets/ic_location@3x.png"
              alt="Location"
            />
            <span class="house-details__location-text">
              {{ extractedHouse?.location.zip }} {{ extractedHouse?.location.city }}
            </span>
          </div>

          <!-- Price and Basic Info -->
          <div class="house-details__price-info">
            <div class="house-details__basic-info">
              <div class="house-details__info-item">
                <img class="house-details__icon" src="/public/assets/ic_price@3x.png" alt="Size" />
                <span>{{ extractedHouse?.price.toLocaleString() }} m²</span>
              </div>
              <div class="house-details__info-item">
                <img class="house-details__icon" src="/public/assets/ic_size@3x.png" alt="Size" />
                <span>{{ extractedHouse?.size }} m²</span>
              </div>
              <div class="house-details__info-item">
                <img
                  class="house-details__icon"
                  src="/public/assets/ic_construction_date@3x.png"
                  alt="Built in"
                />
                <span>Built in {{ extractedHouse?.constructionYear }}</span>
              </div>
            </div>
            <div class="house-details__room-info">
              <div class="house-details__info-item">
                <img
                  class="house-details__icon"
                  src="/public/assets/ic_bed@3x.png"
                  alt="Bedrooms"
                />
                <span>{{ extractedHouse?.rooms.bedrooms }}</span>
              </div>
              <div class="house-details__info-item">
                <img
                  class="house-details__icon"
                  src="/public/assets/ic_bath@3x.png"
                  alt="Bathrooms"
                />
                <span>{{ extractedHouse?.rooms.bathrooms }}</span>
              </div>
              <div class="house-details__info-item">
                <img
                  class="house-details__icon"
                  src="/public/assets/ic_garage@3x.png"
                  alt="Garage"
                />
                <span>{{ extractedHouse?.hasGarage ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="house-details__description">
            <p class="house-details__description-text">
              {{ extractedHouse?.description }}
            </p>
          </div>
        </div>
      </div>

      <div class="house-details__recommended">
        <h2>Recommended for you</h2>
        <NuxtLink
          v-for="recommendedHouse in houses.filter((house) => house.id !== id).slice(0, 3)"
          :key="recommendedHouse.id"
          :to="`/houses/${recommendedHouse.id}`"
          class="house-details__recommended-link"
        >
          <HouseCard :house="recommendedHouse" :show-actions="false" :loading="loading" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.house-card) {
  margin-bottom: $spacing-md;
  width: 100%;
  @media (min-width: $breakpoint-lg) {
    max-width: 280px;
  }

  .house-card__details {
    padding: $spacing-md $spacing-sm;
  }
  .house-card__image-wrapper {
    width: 120px;
    height: 120px;
  }
  .house-card__title {
    font-size: $font-size-h2-mobile;
  }
  .house-card__price {
    font-size: $font-size-h2-mobile;
  }
  .house-card__location {
    font-size: $font-size-body-mobile;
  }
  .house-card__feature-icon {
    width: 14px;
  }
  .listing-info {
    font-size: $font-size-body-mobile;
  }
  .house-card__actions {
    display: none;
  }
  &:hover .house-card__actions {
    display: none;
  }
}
.house-details {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
  max-width: $container-lg;
  margin: 0 auto;

  @media (min-width: $breakpoint-lg) {
    align-items: start;
    padding: $spacing-lg;
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-2xl;

    @media (min-width: $breakpoint-lg) {
      grid-template-columns: 2fr 1fr;
      gap: $spacing-xl;
    }
  }

  &__article {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  &__image-container {
    position: relative;
    width: 100%;
    max-width: none;

    @media (min-width: $breakpoint-lg) {
      width: 100%;
    }

    &--back {
      position: absolute;
      left: $spacing-sm;
      top: $spacing-sm;
    }

    &--mobile {
      display: flex;
      width: 100%;
      padding-top: $spacing-md;

      @media (min-width: $breakpoint-lg) {
        display: none;
      }
    }
    &--bulks {
      display: flex;
      position: absolute;
      top: $spacing-sm;
      right: $spacing-sm;
      width: 90px;
    }
  }
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__back {
    display: none;
    align-items: center;
    gap: $spacing-md;
    cursor: pointer;
    text-decoration: none;
    margin-bottom: $spacing-lg;

    &:hover .house-details__back-text {
      text-decoration: none;
    }
    &--icon {
      width: $icon-size-sm;
      height: $icon-size-sm;
      object-fit: contain;
    }

    &--text {
      font-weight: $font-weight-semibold;
      font-size: $font-size-button-desktop;
      color: $text-primary;
    }
  }
  &__actions {
    gap: $spacing-sm;

    @media (min-width: $breakpoint-lg) {
      width: auto;
    }
  }
  &__action-btn {
    width: $icon-size-md;
    height: $icon-size-md;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;

    &:hover {
      background: rgba($background-1, 0.5);
    }

    img {
      width: $icon-size-1xs;
      height: $icon-size-1xs;
    }
  }

  &__info-card {
    background: white;
    border-radius: $border-radius-lg;
    margin-top: -10px;
    padding: $spacing-xl;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;

    @media (min-width: $breakpoint-lg) {
      order: 2;
      border-radius: 0;
      margin-top: 0;
      padding: $spacing-lg;
    }
    &--desktop {
      display: flex;
      position: absolute;
      top: $spacing-md;
      right: $spacing-md;

      @media (max-width: #{$breakpoint-lg - 1px}) {
        display: none;
      }
    }
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;
  }

  &__title {
    font-size: $font-size-h2-mobile;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
    line-height: 1.2;
    flex: 1;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h1-desktop;
    }
  }
  &__location {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;
  }

  &__icon {
    width: 16px;
    height: 16px;
    object-fit: contain;
    opacity: 0.7;
  }

  &__location-text {
    color: $text-secondary;
    font-size: $font-size-body-mobile;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  &__price-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__price {
    font-size: $font-size-h2-mobile;
    font-weight: 700;
    color: $text-primary;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h2-desktop;
    }
  }

  &__basic-info,
  &__room-info {
    display: flex;
    gap: $spacing-lg;
    flex-wrap: wrap;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-body-mobile;
    color: $text-secondary;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  &__description {
    margin-bottom: $spacing-xl;
  }

  &__description-text {
    color: $text-secondary;
    line-height: 1.6;
    font-size: $font-size-body-mobile;
    margin: 0;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  &__recommended {
    width: 100%;
    padding: $spacing-lg;

    @media (min-width: $breakpoint-lg) {
      min-width: 300px;
      max-width: 350px;
      padding: 0;
    }

    h2 {
      font-size: $font-size-h2-mobile;
      font-weight: 700;
      color: $text-primary;
      margin: 0 0 $spacing-lg 0;

      @media (min-width: $breakpoint-lg) {
        font-size: $font-size-h2-desktop;
      }
    }
  }

  &__recommended-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__recommended-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  @media (min-width: $breakpoint-lg) {
    &__back {
      display: flex;
    }
  }
}
</style>
