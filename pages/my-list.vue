<script setup lang="ts">
import HouseList from '~/components/HouseList.vue'
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
    <div class="my-list-page__grid">
      <HouseList
        :loading="loading"
        :houses="myHouses"
        empty-message="You have not created any listings yet."
        @list-removed="handleDelete"
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
