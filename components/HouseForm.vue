<script setup lang="ts">
import type { CreateHouseRequest, ApiHouse } from '~/types/api'

const props = defineProps<{ house?: ApiHouse[]; loading?: boolean }>()

const form = reactive<CreateHouseRequest>({
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  size: 0,
  streetName: '',
  houseNumber: 0,
  numberAddition: '',
  zip: '',
  city: '',
  constructionYear: 0,
  hasGarage: false,
  description: '',
})

// const emit = defineEmits<Emits>()
const imageFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const existingImageUrl = ref<string | null>(null)

const submitting = ref(false)
const hasExistingImage = computed(() => {
  // If previewUrl is set and is not a blob (i.e., not a newly uploaded file), treat as existing image
  return (
    !!previewUrl.value &&
    typeof previewUrl.value === 'string' &&
    !previewUrl.value.startsWith('blob:')
  )
})

interface Emits {
  submit: [payload: { form: CreateHouseRequest; imageFile: File | string | null }]
}
const emit = defineEmits<Emits>()

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  imageFile.value = file
}
const { errors, validateForm } = useHouseFormValidation()

function submit() {
  const valid = validateForm(form, imageFile.value, hasExistingImage.value)
  if (!valid) return
  const imageToSubmit = imageFile.value || existingImageUrl.value
  emit('submit', { form, imageFile: imageToSubmit })
}

watch(imageFile, (file, _prev) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

/** Hydrate the form whenever an edit-house arrives/changes */

watch(
  () => props.house,
  async (house) => {
    if (!house || !Array.isArray(house) || house.length === 0 || !house[0]) return
    const h = house[0]
    Object.assign(form, {
      price: h.price ?? 0,
      bedrooms: h.rooms?.bedrooms ?? 0,
      bathrooms: h.rooms?.bathrooms ?? 0,
      size: h.size ?? 0,
      streetName: h.location?.street ?? '',
      houseNumber: h.location?.houseNumber ?? 0,
      numberAddition: h.location?.houseNumberAddition ?? '',
      zip: h.location?.zip ?? '',
      city: h.location?.city ?? '',
      constructionYear: h.constructionYear ?? 0,
      hasGarage: h.hasGarage ?? false,
      description: h.description ?? '',
    })

    if (h.image) {
      previewUrl.value = h.image
      existingImageUrl.value = h.image
    }
  },
  { immediate: true }
)
</script>

<template>
  <form class="house-form" @submit.prevent="submit">
    <!-- Street name -->
    <div class="house-form__field">
      <label class="house-form__label">Street name*</label>
      <input
        v-model="form.streetName"
        type="text"
        placeholder="Enter the street name"
        class="house-form__input"
        :class="{ 'house-form__input--error': errors.streetName }"
      />
      <span v-if="errors.streetName" class="house-form__error">{{ errors.streetName }}</span>
    </div>

    <!-- House number and Addition -->
    <div class="house-form__row">
      <div class="house-form__field">
        <label class="house-form__label">House number*</label>
        <input
          v-model.number="form.houseNumber"
          type="number"
          placeholder="Enter house number"
          class="house-form__input"
          :class="{ 'house-form__input--error': errors.houseNumber }"
        />
        <span v-if="errors.houseNumber" class="house-form__error">{{ errors.houseNumber }}</span>
      </div>

      <div class="house-form__field">
        <label class="house-form__label">Addition (optional)</label>
        <input
          v-model="form.numberAddition"
          type="number"
          placeholder="e.g. A"
          class="house-form__input"
        />
      </div>
    </div>

    <!-- Postal code -->
    <div class="house-form__field">
      <label class="house-form__label">Postal code*</label>
      <input
        v-model="form.zip"
        type="text"
        placeholder="e.g. 1000 AA"
        class="house-form__input"
        :class="{ 'house-form__input--error': errors.zip }"
      />
      <span v-if="errors.zip" class="house-form__error">{{ errors.zip }}</span>
    </div>

    <!-- City -->
    <div class="house-form__field">
      <label class="house-form__label">City*</label>
      <input
        v-model="form.city"
        type="text"
        placeholder="e.g. Utrecht"
        class="house-form__input"
        :class="{ 'house-form__input--error': errors.city }"
      />
      <span v-if="errors.city" class="house-form__error">{{ errors.city }}</span>
    </div>

    <!-- Image upload -->
    <div class="house-form__field">
      <label class="house-form__label">Upload picture (PNG or JPG)*</label>
      <div class="house-form__image-upload" @click="triggerFileInput">
        <div v-if="!previewUrl" class="house-form__image-placeholder">
          <img
            src="/public/assets/ic_plus_grey@3x.png"
            alt="Upload"
            class="house-form__plus-icon"
          />
        </div>
        <img v-else :src="previewUrl" alt="Preview" class="house-form__image-preview" />
      </div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="house-form__file-input"
        @change="onFileChange"
      />
      <span v-if="errors.image" class="house-form__error">{{ errors.image }}</span>
    </div>

    <!-- Price -->
    <div class="house-form__field">
      <label class="house-form__label">Price*</label>
      <input
        v-model.number="form.price"
        type="number"
        placeholder="e.g. €150.000"
        class="house-form__input"
        :class="{ 'house-form__input--error': errors.price }"
      />
      <span v-if="errors.price" class="house-form__error">{{ errors.price }}</span>
    </div>

    <!-- Size and Garage -->
    <div class="house-form__row">
      <div class="house-form__field">
        <label class="house-form__label">Size*</label>
        <input
          v-model.number="form.size"
          type="number"
          placeholder="e.g. 60m2"
          class="house-form__input"
          :class="{ 'house-form__input--error': errors.size }"
        />
        <span v-if="errors.size" class="house-form__error">{{ errors.size }}</span>
      </div>

      <div class="house-form__field">
        <label class="house-form__label">Garage*</label>
        <select v-model="form.hasGarage" class="house-form__input house-form__select">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>
    </div>

    <!-- Bedrooms and Bathrooms -->
    <div class="house-form__row">
      <div class="house-form__field">
        <label class="house-form__label">Bedrooms*</label>
        <input
          v-model.number="form.bedrooms"
          type="number"
          placeholder="Enter amount"
          class="house-form__input"
          :class="{ 'house-form__input--error': errors.bedrooms }"
        />
        <span v-if="errors.bedrooms" class="house-form__error">{{ errors.bedrooms }}</span>
      </div>

      <div class="house-form__field">
        <label class="house-form__label">Bathrooms*</label>
        <input
          v-model.number="form.bathrooms"
          type="number"
          placeholder="Enter amount"
          class="house-form__input"
          :class="{ 'house-form__input--error': errors.bathrooms }"
        />
        <span v-if="errors.bathrooms" class="house-form__error">{{ errors.bathrooms }}</span>
      </div>
    </div>

    <!-- Construction date -->
    <div class="house-form__field">
      <label class="house-form__label">Construction date*</label>
      <input
        v-model.number="form.constructionYear"
        type="number"
        placeholder="e.g. 1990"
        class="house-form__input"
        :class="{ 'house-form__input--error': errors.constructionYear }"
      />
      <span v-if="errors.constructionYear" class="house-form__error">{{
        errors.constructionYear
      }}</span>
    </div>

    <!-- Description -->
    <div class="house-form__field">
      <label class="house-form__label">Description*</label>
      <textarea
        v-model="form.description"
        placeholder="Enter description"
        class="house-form__textarea"
        :class="{ 'house-form__textarea--error': errors.description }"
        rows="5"
      />
      <span v-if="errors.description" class="house-form__error">{{ errors.description }}</span>
    </div>

    <!-- Submit button -->
    <button type="submit" class="house-form__submit" :disabled="submitting">
      {{ submitting ? 'Submitting…' : 'Create' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.house-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  max-width: 400px;

  &__field {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 100%;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 50% 50%;
    }
  }

  &__label {
    font-family: $font-family-primary;
    font-weight: $font-weight-semibold;
    font-size: $font-size-input-title-mobile;
    color: $text-primary;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-input-title-desktop;
    }
  }

  &__input,
  &__select,
  &__textarea {
    padding: $spacing-1sm $spacing-md;
    border: 0;
    border-radius: $border-radius-md;
    font-family: $font-family-secondary;
    font-size: $font-size-input-field-mobile;
    background: $background-2;
    color: $text-primary;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-input-field-desktop;
    }

    &::placeholder {
      color: $text-secondary;
      opacity: 0.6;
    }

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &--error {
      border-color: $error-color;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
    font-family: $font-family-secondary;
  }

  &__image-upload {
    width: 100px;
    height: 100px;
    border: 2px dashed $tertiary-color-2;
    border-radius: $border-radius-md;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color $transition-fast ease;

    &:hover {
      border-color: $primary-color;
    }
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $background-1;
  }

  &__plus-icon {
    width: $icon-size-sm;
    height: $icon-size-sm;
    color: $text-secondary;
    font-weight: $font-weight-regular;
  }

  &__image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__file-input {
    display: none;
  }

  &__error {
    font-family: $font-family-primary;
    font-weight: $font-weight-medium-italic;
    font-style: italic;
    font-size: $font-size-error-message-mobile;
    color: $error-color;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-error-message-desktop;
    }
  }

  &__submit {
    background: $primary-color;
    color: $background-2;
    border: none;
    border-radius: $border-radius-sm;
    padding: $spacing-md $spacing-lg;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-button-mobile;
    cursor: pointer;
    transition: background-color $transition-fast ease;
    align-self: flex-start;
    min-width: 200px;

    @media (min-width: $breakpoint-lg) {
      font-size: $font-size-button-desktop;
    }

    &:hover:not(:disabled) {
      background: $primary-color-dark;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
