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

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa el nombre del producto.'),
  slug: optionalText,
  shortDescription: optionalText,
  description: optionalText,
  primaryCategoryId: z.string().uuid('Selecciona una categoría.'),
  brandId: optionalText,
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  sku: z.string().trim().min(2, 'Ingresa el SKU.'),
  price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0.'),
  compareAtPrice: z.coerce.number().min(0).optional(),
})

export const updateProductSchema = createProductSchema

export const rolePermissionsSchema = z.object({
  permissionSlugs: z
    .array(z.string())
    .min(1, 'Selecciona al menos un permiso.'),
})
