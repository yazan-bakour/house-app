<script setup lang="ts">
import HouseList from '~/components/HouseList.vue'
import LoaderSvg from '~/components/LoaderSvg.vue'
import type { ApiHouse } from '~/types/api'

useHead({
  title: 'My listing - YBK Real Estate',
  meta: [{ name: 'description', content: 'View and remove your created house listing.' }],
})

const { houses, refresh, loading } = useFetchHouses()
const myHouses = computed<ApiHouse[]>(() =>
  houses.value.filter((h: ApiHouse) => h.madeByMe === true)
)

const {
  confirmDelete,
  loading: deleteLoading,
  showDialog,
  closeDialog,
  openDialog,
} = useDeleteDialog()

const handleDelete = (houseId: number) => {
  openDialog(houseId)
}
const handleDeleteConfirm = async () => {
  await confirmDelete(async () => {
    await refresh()
  })
}
const handleEdit = (houseId: number) => {
  navigateTo(`/houses/edit/${houseId}`)
}
</script>

<template>
  <div class="my-list-page">
    <h1 class="my-list-page__title">My Listings</h1>
    <!-- Loading State -->
    <div
      v-if="loading"
      class="my-list-page__state my-list-page__state--loading"
    >
      <LoaderSvg />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="myHouses.length === 0"
      class="my-list-page__state my-list-page__state--empty"
    >
      <EmptyState />
      <p class="my-list-page__empty-message empty-state-message">
        You have not created any listings yet.<br>Create your first house listing to get started!
      </p>
      <NuxtLink to="/houses/create" class="btn btn-primary my-list-page__create-btn">
        Create Listing
      </NuxtLink>
    </div>

    <!-- My Listings -->
    <div v-else class="my-list-page__grid">
      <HouseList
        :loading="loading"
        :houses="myHouses"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </div>
    <DeleteDialog
      :show="showDialog"
      :loading="deleteLoading"
      @confirm="handleDeleteConfirm"
      @cancel="closeDialog"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.house-card) {
  width: 100%;

  .house-card__action--favorite {
    display: none;
  }
}
.my-list-page {
  max-width: $container-lg;
  margin: 0 auto;
  padding: $spacing-xl;

  &__title {
    font-size: $font-size-h1-mobile;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin-bottom: $spacing-xl;
    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-h1-desktop;
    }
  }

  &__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;

    &--empty {
      gap: $spacing-md;
    }

    &--loading {
      gap: $spacing-md;
    }
  }

  &__empty-message {
    margin: 0;
    font-family: $font-family-primary;
    font-size: $font-size-body-mobile;
    color: $text-secondary;
    line-height: 1.4;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  &__create-btn {
    margin-top: $spacing-md;
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
