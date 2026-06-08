import { z } from 'zod'

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === '' ? undefined : value))

const optionalPassword = z
  .string()
  .optional()
  .transform((value) => (value === '' ? undefined : value))
  .refine((value) => value === undefined || value.length >= 8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })

export const emailField = z
  .string({ message: 'El correo es obligatorio.' })
  .trim()
  .min(1, 'El correo es obligatorio.')
  .email('Correo electrónico inválido.')

export const passwordField = z
  .string({ message: 'La contraseña es obligatoria.' })
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')

export const loginSchema = z.object({
  email: emailField,
  password: z.string({ message: 'La contraseña es obligatoria.' }).min(1, 'La contraseña es obligatoria.'),
})

const personFieldsSchema = z.object({
  email: emailField,
  password: passwordField,
  firstName: optionalText,
  lastName: optionalText,
  phone: optionalText,
})

export const registerSchema = personFieldsSchema.omit({ phone: true })

export const createCustomerSchema = personFieldsSchema

export const createStaffUserSchema = personFieldsSchema.extend({
  roleSlugs: z
    .array(z.string())
    .min(1, 'Selecciona al menos un rol.'),
})

export const updateCustomerSchema = z.object({
  firstName: optionalText,
  lastName: optionalText,
  phone: optionalText,
  status: z.enum(['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED']),
  password: optionalPassword,
  clearEmailVerification: z.boolean().optional(),
})

export const updateStaffUserSchema = z.object({
  firstName: optionalText,
  lastName: optionalText,
  phone: optionalText,
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  password: optionalPassword,
  roleSlugs: z.array(z.string()).optional(),
})

export const updateStaffUserWithRolesSchema = updateStaffUserSchema.extend({
  roleSlugs: z
    .array(z.string())
    .min(1, 'Selecciona al menos un rol.'),
})

export const verifyEmailSchema = z.object({
  email: emailField,
  code: z
    .string({ message: 'El código es obligatorio.' })
    .trim()
    .regex(/^\d{6}$/, 'El código debe tener 6 dígitos.'),
})

export const resendVerificationSchema = z.object({
  email: emailField,
})

const catalogSlugField = optionalText

const activeStatusField = z.enum(['true', 'false'])

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre de la categoría.'),
  slug: catalogSlugField,
  description: optionalText,
  parentId: optionalText,
  sortOrder: z.coerce.number().int().min(0),
  isActive: activeStatusField,
})

export const createBrandSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre de la marca.'),
  slug: catalogSlugField,
  description: optionalText,
  website: optionalText,
  isActive: activeStatusField,
})

export const createAttributeSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre del atributo.'),
  slug: catalogSlugField,
  description: optionalText,
  dataType: z.enum(['TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'MULTI_SELECT']),
  unit: optionalText,
  scope: z.enum(['PRODUCT', 'VARIANT']),
  optionsText: optionalText,
  isFilterable: z.boolean().optional(),
  isRequired: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0),
})

export const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre del producto.'),
  slug: optionalText,
  shortDescription: optionalText,
  description: optionalText,
  primaryCategoryId: z.string().uuid('Selecciona una categoría.'),
  brandId: optionalText,
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  productType: z.enum(['SIMPLE', 'VARIABLE']),
  categoryIds: z.array(z.string()).optional(),
  metaTitle: optionalText,
  metaDescription: optionalText,
  tagsText: optionalText,
  sku: optionalText,
  barcode: optionalText,
  price: z.coerce.number().min(0).optional(),
  compareAtPrice: z.coerce.number().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),
  weight: z.coerce.number().min(0).optional(),
})

export const createProductSchema = productFormSchema
export const updateProductSchema = productFormSchema

export const rolePermissionsSchema = z.object({
  permissionSlugs: z
    .array(z.string())
    .min(1, 'Selecciona al menos un permiso.'),
})

export const warehouseFormSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre del almacén.'),
  code: z.string().trim().min(2, 'Ingresa el código del almacén.').max(32),
  description: optionalText,
  address: optionalText,
  isDefault: z.enum(['true', 'false']),
  isActive: z.enum(['true', 'false']),
  sortOrder: z.coerce.number().min(0),
})

export const stockMovementSchema = z.object({
  warehouseId: z.string().uuid('Selecciona un almacén.'),
  variantId: z.string().uuid('Selecciona una variante.'),
  type: z.enum(['RECEIPT', 'SHIPMENT', 'ADJUSTMENT', 'TRANSFER']),
  quantity: z.coerce.number().refine((value) => value !== 0, 'La cantidad no puede ser cero.'),
  note: optionalText,
  targetWarehouseId: optionalText,
})

export const stockReservationSchema = z.object({
  warehouseId: z.string().uuid('Selecciona un almacén.'),
  variantId: z.string().uuid('Selecciona una variante.'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  reference: optionalText,
  note: optionalText,
})

const boolSelect = z.enum(['true', 'false'])

export const companyProfileSchema = z.object({
  legalName: optionalText,
  tradeName: optionalText,
  taxId: optionalText,
  taxRegime: optionalText,
  fiscalAddress: optionalText,
  district: optionalText,
  province: optionalText,
  department: optionalText,
  country: z.string().trim().min(2).max(2).optional().or(z.literal('')),
  supportEmail: z.string().trim().email('Correo inválido.').optional().or(z.literal('')),
  supportPhone: optionalText,
  whatsapp: optionalText,
  website: optionalText,
})

export const storeSettingsSchema = z.object({
  storeName: z.string().trim().min(2, 'Ingresa el nombre de la tienda.'),
  storeTagline: optionalText,
  defaultLocale: z.string().trim().min(2),
  timezone: z.string().trim().min(2),
  defaultCurrencyCode: z.string().trim().min(3).max(3),
  defaultTaxRateId: optionalText,
  pricesIncludeTax: boolSelect,
  metaTitleDefault: optionalText,
  metaDescriptionDefault: optionalText,
  maintenanceMode: boolSelect,
  maintenanceMessage: optionalText,
  guestCheckoutEnabled: boolSelect,
  minOrderAmount: z.coerce.number().min(0).optional().or(z.literal('')),
  orderNumberPrefix: z.string().trim().min(1),
  defaultWarehouseId: optionalText,
  lowStockGlobalThreshold: z.coerce.number().min(0).optional().or(z.literal('')),
  freeShippingMinAmount: z.coerce.number().min(0).optional().or(z.literal('')),
  handlingDaysMin: z.coerce.number().min(0).optional().or(z.literal('')),
  handlingDaysMax: z.coerce.number().min(0).optional().or(z.literal('')),
  warrantyPolicyUrl: optionalText,
  returnsPolicyUrl: optionalText,
  privacyPolicyUrl: optionalText,
  termsUrl: optionalText,
  complaintsBookUrl: optionalText,
  serialNumberRequired: boolSelect,
  orderConfirmationEmailEnabled: boolSelect,
  mailFromName: optionalText,
})

export const currencyFormSchema = z.object({
  code: z.string().trim().min(3).max(3),
  name: z.string().trim().min(2),
  symbol: z.string().trim().min(1).max(8),
  exchangeRate: z.coerce.number().min(0),
  decimalPlaces: z.coerce.number().min(0).max(4),
  isDefault: boolSelect,
  isActive: boolSelect,
  sortOrder: z.coerce.number().min(0),
})

export const taxRateFormSchema = z.object({
  name: z.string().trim().min(2),
  code: optionalText,
  rate: z.coerce.number().min(0).max(100),
  isDefault: boolSelect,
  isActive: boolSelect,
  appliesToShipping: boolSelect,
  sortOrder: z.coerce.number().min(0),
})
