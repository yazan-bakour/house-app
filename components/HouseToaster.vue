<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  show: boolean
}>()

const emit = defineEmits(['update:show'])

const visible = ref(props.show)
let timeoutId: NodeJS.Timeout | null = null

watch(
  () => props.show,
  (val) => {
    visible.value = val

    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    // Set new timeout if toast is shown and duration is specified
    if (val && props.duration) {
      timeoutId = setTimeout(() => close(), props.duration)
    }
  }
)

function close() {
  visible.value = false
  emit('update:show', false)

  // Clear timeout when manually closing
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// Get appropriate icon for each toast type
const getIcon = (toastType?: string) => {
  switch (toastType) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
    default:
      return 'ℹ'
  }
}
</script>

<template>
  <Transition name="toast" appear>
    <div v-if="visible" class="toaster" :class="`toaster--${type}`">
      <span class="toaster__icon">{{ getIcon(type) }}</span>
      <span class="toaster__message">{{ message }}</span>
      <button class="toaster__close" @click="close" aria-label="Close notification">
        <img src="/public/assets/ic_clear_white@3x.png" alt="Close" width="20" height="20" />
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.toaster {
  position: fixed;
  top: $spacing-lg;
  right: $spacing-lg;
  z-index: 9999;
  padding: $spacing-md $spacing-lg;
  color: $text-light;
  font-size: $font-size-body-mobile;
  font-family: $font-family-primary;
  box-shadow: $shadow-lg;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  min-width: 250px;
  max-width: 400px;
  backdrop-filter: blur(10px);

  @media (min-width: $breakpoint-lg) {
    font-size: $font-size-body-desktop;
  }

  // Modifiers for different toast types
  &--success {
    background: $text-link;
  }

  &--error {
    background: $error-color;
  }

  &--info {
    background: $secondary-color;
  }

  &--warning {
    background: $tertiary-color-2;
  }

  // Elements
  &__icon {
    font-size: 1.1em;
    font-weight: $font-weight-bold;
    flex-shrink: 0;
  }

  &__message {
    flex: 1;
    line-height: 1.4;
    font-weight: $font-weight-medium;
  }

  &__close {
    background: none;
    border: none;
    color: $text-light;
    font-size: 1.4em;
    cursor: pointer;
    margin-left: auto;
    width: $icon-size-sm;
    height: $icon-size-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color $transition-fast ease;
    flex-shrink: 0;

    &:focus {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  // Mobile responsiveness
  @media (max-width: $breakpoint-md) {
    top: $spacing-md;
    right: $spacing-md;
    left: $spacing-md;
    max-width: none;
    font-size: $font-size-body-mobile;
    padding: $spacing-sm $spacing-md;

    &__icon {
      font-size: 1em;
    }

    &__close {
      width: 20px;
      height: 20px;
      font-size: 1.2em;
    }
  }
}

// Toast transition animations
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

// High contrast mode support
@media (prefers-contrast: high) {
  .toaster {
    border: 2px solid currentColor;
    box-shadow: none;

    &--success {
      background: $text-link;
    }

    &--error {
      background: $error-color;
    }

    &--info {
      background: $secondary-color;
    }

    &--warning {
      background: $tertiary-color-2;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.2s ease;
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }

  .toaster__close {
    transition: none;

    &:active {
      transform: none;
    }
  }
}
</style>
