# 🎨 Optimized Icon System

A comprehensive, performant, and type-safe icon management system for the House Management App.

## 📁 Architecture

```
├── components/
│   ├── SmartImage.vue          # Reusable icon component
│  
├── composables/
│   └── useIcons.ts          # Icon composables
├── constants/
│   └── icons.ts             # Icon constants and mappings
├── utils/
│   └── iconLoader.ts        # Core icon loading logic
└── plugins/
    └── icons.client.ts      # Icon preloader plugin
```

## 🚀 Features

### ✅ Performance Optimizations
- **Dynamic imports** with caching to prevent duplicate loads
- **Preloading** of critical navigation icons
- **Promise-based loading** with error handling
- **Memory-efficient caching** system

### ✅ Developer Experience
- **Type-safe** icon names and usage
- **Centralized configuration** for all icons
- **Reactive composables** for Vue integration
- **Reusable components** with consistent API

### ✅ Maintainability
- **Organized constants** for easy icon management
- **Clear separation of concerns**
- **Comprehensive error handling**
- **Debug utilities** for development

## 🛠 Usage Examples

### 1. Using Composables

```vue
<script setup>
const { useNavigationIcon, useAppIcon } = useIcons()

const isActive = ref(false)
const homeIcon = useNavigationIcon('home', isActive)
const logo = useAppIcon('LOGO')
</script>

<template>
  <img :src="homeIcon" alt="Home" />
  <img :src="logo" alt="Logo" />
</template>
```

### 3. Direct Loading (Advanced)

```vue
<script setup>
import { getAppIcon, getNavigationIcon } from '~/utils/iconLoader'

const iconUrl = ref('')

onMounted(async () => {
  iconUrl.value = await getAppIcon('SEARCH')
})
</script>
```

## 📋 Available Icons

### Navigation Icons
- `home` - Home/Houses page navigation
- `info` - About/Information page navigation

### App Icons
- `LOGO` - DTT company logo
- `SEARCH` - Search functionality
- `EDIT` / `EDIT_WHITE` - Edit actions
- `DELETE` / `DELETE_WHITE` - Delete actions
- `PLUS_GREY` / `PLUS_WHITE` - Add actions
- `BACK_GREY` / `BACK_WHITE` - Back navigation
- `CLEAR` / `CLEAR_WHITE` - Clear/close actions
- `UPLOAD` - File upload

### House Listing Icons
- `BATH` - Bathroom count
- `BED` - Bedroom count
- `GARAGE` - Garage information
- `LOCATION` - Address/location
- `PRICE` - Property price
- `SIZE` - Property size
- `CONSTRUCTION_DATE` - Construction year

This system provides a robust, scalable, and maintainable approach to icon management while improving performance and developer experience!
