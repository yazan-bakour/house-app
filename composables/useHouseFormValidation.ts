import { reactive } from 'vue'
import type { CreateHouseRequest } from '~/types/api'

type ErrorKeys =
  | 'streetName' | 'houseNumber' | 'zip' | 'city' | 'image'
  | 'price' | 'size' | 'bedrooms' | 'bathrooms'
  | 'constructionYear' | 'description'

const NL_ZIP = /^\d{4}\s?[A-Za-z]{2}$/
const currentYear = new Date().getFullYear()

export function useHouseFormValidation() {
  const errors = reactive<Record<ErrorKeys, string>>({
    streetName: '', houseNumber: '', zip: '', city: '', image: '',
    price: '', size: '', bedrooms: '', bathrooms: '',
    constructionYear: '', description: '',
  })

  function clearErrors() {
    (Object.keys(errors) as ErrorKeys[]).forEach(k => (errors[k] = ''))
  }

  const isPosInt = (n: unknown) => Number.isInteger(n) && (n as number) > 0
  const isNonNegInt = (n: unknown) => Number.isInteger(n) && (n as number) >= 0

  function validateForm(form: CreateHouseRequest, imageFile: File | null, hasExistingImage: boolean): boolean {
    clearErrors()
    let ok = true

    if (!form.streetName.trim()) { errors.streetName = 'Street name is required'; ok = false }
    if (!form.zip.trim()) { errors.zip = 'Postal code is required'; ok = false }
    else if (!NL_ZIP.test(form.zip.trim())) { errors.zip = 'Use format 1234AB or 1234 AB'; ok = false }
    if (!form.city.trim()) { errors.city = 'City is required'; ok = false }
    if (!form.description.trim()) { errors.description = 'Description is required'; ok = false }

    if (!isPosInt(form.houseNumber)) { errors.houseNumber = 'House number must be a positive integer'; ok = false }
    if (!(typeof form.price === 'number' && isFinite(form.price) && form.price > 0)) { errors.price = 'Price must be > 0'; ok = false }
    if (!(typeof form.size === 'number' && isFinite(form.size) && form.size > 0)) { errors.size = 'Size must be > 0'; ok = false }
    if (!isNonNegInt(form.bedrooms)) { errors.bedrooms = 'Bedrooms must be an integer ≥ 0'; ok = false }
    if (!isNonNegInt(form.bathrooms)) { errors.bathrooms = 'Bathrooms must be an integer ≥ 0'; ok = false }
    if (!isPosInt(form.constructionYear) || form.constructionYear < 1800 || form.constructionYear > currentYear) {
      errors.constructionYear = `Construction year must be between 1800 and ${currentYear}`; ok = false
    }

    if (!imageFile && !hasExistingImage) { errors.image = 'Image is required'; ok = false }

    return ok
  }

  return { errors, clearErrors, validateForm }
}
