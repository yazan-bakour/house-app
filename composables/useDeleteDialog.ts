export function useDeleteDialog() {
  const showDialog = ref(false)
  const houseToDelete = ref<number | null>(null)
  const loading = ref(false)

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
      
      closeDialog()
      
      if (onSuccess) {
        await onSuccess()
      }
    } catch (error: unknown) {
      console.error('Failed to delete house:', error)
      alert(`Error deleting house: ${(error as Error).message}`)
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