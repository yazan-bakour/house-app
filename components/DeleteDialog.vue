<script setup lang="ts">
interface Props {
  show: boolean
  loading?: boolean
}

interface Emits {
  confirm: []
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

// Handle clicks outside the modal
const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('cancel')
  }
}

// Handle escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('cancel')
  }
}

// Add/remove escape key listener
watch(
  () => props.show,
  (show) => {
    if (show) {
      document.addEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    }
  }
)

// Cleanup on unmount
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="show" class="delete-dialog__overlay" @click="handleOverlayClick">
        <div class="delete-dialog">
          <div class="delete-dialog__content">
            <h2 class="delete-dialog__title">Delete listing</h2>

            <div class="delete-dialog__message">
              <p class="delete-dialog__text">Are you sure you want to delete this listing?</p>
              <p class="delete-dialog__warning">This action cannot be undone.</p>
            </div>

            <div class="delete-dialog__actions">
              <button
                class="btn delete-dialog__btn delete-dialog__btn--confirm"
                :disabled="loading"
                @click="handleConfirm"
              >
                {{ loading ? 'DELETING...' : 'YES, DELETE' }}
              </button>

              <button
                class="btn delete-dialog__btn delete-dialog__btn--cancel"
                :disabled="loading"
                @click="handleCancel"
              >
                GO BACK
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.delete-dialog {
  // Modal container
  background: $background-2;
  box-shadow: $shadow-lg;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;

  // Overlay
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba($text-primary, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: $spacing-md;
  }

  // Content area
  &__content {
    padding: $spacing-2xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    text-align: center;
  }

  // Title
  &__title {
    margin: 0;
  }

  // Message container
  &__message {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  // Main text
  &__text {
    font-family: $font-family-secondary;
    font-size: $font-size-body-mobile;
    color: $text-primary;
    margin: 0;
    line-height: 1.6;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  // Warning text
  &__warning {
    font-family: $font-family-secondary;
    font-size: $font-size-body-mobile;
    color: $text-secondary;
    margin: 0;
    line-height: 1.6;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-body-desktop;
    }
  }

  // Actions container
  &__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  // Button base styles
  &__btn {
    padding: $spacing-md $spacing-lg;
    min-height: 48px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    // Confirm button modifier
    &--confirm {
      background: $error-color;
      color: $text-light;

      &:hover:not(:disabled) {
        background: $error-color-dark;
      }
    }

    // Cancel button modifier
    &--cancel {
      background: $secondary-color;
      color: $text-light;

      &:hover:not(:disabled) {
        background: $secondary-color-dark;
      }
    }
  }
}

// Transition styles
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity $transition-normal ease;

  .delete-dialog {
    transition: transform $transition-normal ease;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;

  .delete-dialog {
    transform: scale(0.9) translateY(-20px);
  }
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;

  .delete-dialog {
    transform: scale(1) translateY(0);
  }
}
</style>
