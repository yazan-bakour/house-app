import { ref } from 'vue'
import type { FetchError } from 'ofetch'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

interface ApiSuccessOptions {
  message?: string
  duration?: number
}

interface ApiErrorOptions {
  message?: string
  duration?: number
  error?: FetchError
}

const show = ref(false)
const message = ref('')
const type = ref<ToastType>('info')
const duration = ref(3000)

function showToast(options: ToastOptions) {
  message.value = options.message
  type.value = options.type || 'info'
  duration.value = options.duration || 3000
  show.value = true
  
  setTimeout(() => {
    show.value = false
  }, duration.value)
}

function showApiSuccess(options: ApiSuccessOptions = {}) {
  showToast({
    message: options.message || 'Operation completed successfully',
    type: 'success',
    duration: options.duration || 3000
  })
}

function showApiError(options: ApiErrorOptions = {}) {
  let errorMessage = options.message || 'An error occurred'
  
  // Extract meaningful error message from API response
  if (options.error) {
    if (typeof options.error === 'string') {
      errorMessage = options.error
    } else if (options.error?.data?.message) {
      errorMessage = options.error.data.message
    } else if (options.error?.statusMessage) {
      errorMessage = options.error.statusMessage
    } else if (options.error?.message) {
      errorMessage = options.error.message
    }
  }
  
  showToast({
    message: errorMessage,
    type: 'error',
    duration: options.duration || 5000 // Longer duration for errors
  })
}

function hideToast() {
  show.value = false
}

export function useToast() {
  return {
    show,
    message,
    type,
    duration,
    showToast,
    showApiSuccess,
    showApiError,
    hideToast
  }
}