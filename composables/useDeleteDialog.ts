import { useToast } from '~/composables/useToast'

export function useDeleteDialog() {
  const showDialog = ref(false)
  const houseToDelete = ref<number | null>(null)
  const loading = ref(false)
  const { showToast } = useToast()

  const openDialog = (houseId: number) => {
    houseToDelete.value = houseId
    showDialog.value = true
  }

  const closeDialog = () => {
    showDialog.value = false
    houseToDelete.value = null
  }

  const confirmDelete = async (onSuccess?: () => void | Promise<void>) => {
    if (!houseToDelete.value) return
    loading.value = true
    try {
      await $fetch(`/api/houses/${houseToDelete.value}`, {
        method: 'DELETE'
      })
      showToast({ message: 'House deleted successfully', type: 'success' })
      closeDialog()
      if (onSuccess) {
        await onSuccess()
      }
    } catch (error: unknown) {
      console.error('Failed to delete house:', error)
      showToast({ message: `Error deleting house: ${(error as Error).message}`, type: 'error' })
    } finally {
      loading.value = false
    }
  }

  return {
    showDialog: readonly(showDialog),
    loading: readonly(loading),
    openDialog,
    closeDialog,
    confirmDelete
  }
}