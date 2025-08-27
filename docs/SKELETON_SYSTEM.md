# 🎨 Image Skeleton Loading System

A comprehensive, reusable skeleton loading system for images that provides smooth loading experiences without external UI libraries.

## 📁 Architecture

```
components/
├── SmartImage.vue         # Enhanced image with skeleton loading

```

## 🚀 Features

### ✅ **Performance & UX**
- **Smooth loading transitions** with animated skeletons
- **Prevents layout shift** by maintaining dimensions
- **Accessibility support** with proper ARIA attributes
- **Reduced motion support** for users with accessibility needs

### ✅ **Flexibility**
- **Dynamic sizing** via props (width/height as string or number)
- **Error state handling** with graceful fallbacks

### ✅ **Developer Experience**
- **Simple API** with sensible defaults
- **TypeScript support** with full type safety
- **Reusable components** following DRY principles
- **Comprehensive props** for customization

## 🛠 Usage Examples

### 1. Smart Image with Automatic Skeleton

```vue
<template>
  <!-- Automatically shows skeleton while loading -->
  <SmartImage 
    :src="imageUrl"
    label="Description"
    width="60"
    height="60"
    skeleton-variant="rounded"
    animation-speed="normal"
  />
  
  <!-- Navigation icon with skeleton -->
  <SmartImage 
    :src="iconUrl"
    label="Home"
    width="24"
    height="24"
    loading="eager"
    skeleton-variant="rounded"
    animation-speed="fast"
  />
</template>
```

### 3. Navigation Implementation

```vue
<template>
  <!-- Desktop logo with skeleton -->
  <SmartImage 
    :src="logo" 
    label="DTT Logo" 
    :width="40"
    :height="40"
  />
  
  <!-- Mobile navigation icons -->
  <SmartImage 
    :src="homeIcon" 
    label="Houses" 
    :width="24"
    :height="24"
  />
</template>
```

## 📋 Component APIs

### SmartImage Props

| **Prop** | **Type** | **Default** | **Description** |
|----------|----------|-------------|-----------------|
| `src` | `string` | - | **Required** Image source URL |
| `label` | `string` | - | **Required** Alt text |
| `width` | `string \| number` | - | Image width |
| `height` | `string \| number` | - | Image height |
<!-- | `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading strategy |
| `skeletonVariant` | `'default' \| 'circle' \| 'rounded'` | `'default'` | Skeleton style |
| `rounded` | `boolean` | `false` | Rounded corners |
| `animationSpeed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed |
| `containerClass` | `string` | `''` | Additional container classes |
| `imageClass` | `string` | `''` | Additional image classes |
| `errorMessage` | `string` | `'Failed to load image'` | Error state message |
| `showInitialSkeleton` | `boolean` | `true` | Show skeleton on mount | -->

This skeleton system provides a solid foundation for smooth, accessible image loading experiences throughout your application without requiring external UI libraries!
