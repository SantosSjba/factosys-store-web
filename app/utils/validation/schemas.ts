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

export const registerSchema = z.object({
  email: emailField,
  password: passwordField,
  firstName: optionalText,
  lastName: optionalText,
})

export const createCustomerSchema = z.object({
  email: emailField,
  password: passwordField,
  firstName: optionalText,
  lastName: optionalText,
  phone: optionalText,
})

export const createStaffUserSchema = z.object({
  email: emailField,
  password: passwordField,
  firstName: optionalText,
  lastName: optionalText,
  phone: optionalText,
  roleSlugs: z
    .array(z.string())
    .min(1, 'Selecciona al menos un rol.'),
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

export const rolePermissionsSchema = z.object({
  permissionSlugs: z
    .array(z.string())
    .min(1, 'Selecciona al menos un permiso.'),
})
