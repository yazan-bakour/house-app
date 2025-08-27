<script setup lang="ts">
interface Props {
  src: string
  label: string
  height?: string | number
  width?: string | number
}

const props = defineProps<Props>()

// Reactive state
const isLoading = ref(true)
const hasError = ref(false)

// Convert number to px, keep string as is
const normalizeSize = (size: string | number | undefined): string => {
  if (!size) return 'auto'
  return typeof size === 'number' ? `${size}px` : size
}

// Computed styles
const skeletonStyle = computed(() => ({
  width: normalizeSize(props.width || '40px'), // Use the width prop or default
  height: normalizeSize(props.height || '40px'), // Use the height prop or default
}))

const imageStyle = computed(() => ({
  height: normalizeSize(props.height),
  maxWidth: '100%',
}))

const errorStyle = computed(() => ({
  width: '100%',
  height: normalizeSize(props.height || '40px'),
}))

// Event handlers
const onLoad = () => {
  // Add a small delay to make skeleton visible for testing
  setTimeout(() => {
    isLoading.value = false
    hasError.value = false
  }, 300) // 300ms delay to see skeleton effect
}

const onError = () => {
  isLoading.value = false
  hasError.value = true
}

// Watch for src changes to reset state
watch(
  () => props.src,
  () => {
    isLoading.value = true
    hasError.value = false
  }
)
</script>

<template>
  <div class="smart-image">
    <!-- Show skeleton while loading -->
    <div
      v-if="isLoading"
      class="image-skeleton"
      :style="skeletonStyle"
      :aria-label="`Loading ${label}`"
    ></div>

    <!-- Actual image -->
    <img
      v-show="!isLoading && !hasError"
      :src="src"
      :alt="label"
      :style="imageStyle"
      @load="onLoad"
      @error="onError"
    />

    <!-- Error state -->
    <div v-if="hasError" class="image-error" :style="errorStyle">
      <span class="error-text">Failed to load image</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.smart-image {
  position: relative;
  display: inline-block;
  line-height: 0;
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
  border-radius: $border-radius-sm;
  position: relative;
  overflow: hidden;
  display: block;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $tertiary-color;
  border: 1px solid $tertiary-color-2;
  border-radius: $border-radius-sm;
  padding: $spacing-md;
}

.error-text {
  font-size: 12px;
  color: $text-secondary;
  font-weight: $font-weight-medium;
  text-align: center;
}

img {
  display: block;
  max-width: 100%;
  object-fit: cover;
}
</style>
