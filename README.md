# Factosys Store Web

Frontend de la tienda (Nuxt 4 + Vue 3 + Tailwind) integrado con [factosys-store-api](https://github.com/SantosSjba/factosys-store-api).

## Arquitectura

| Capa | Tecnología |
|------|------------|
| Frontend tienda | Nuxt 4, Vue 3, TypeScript, Tailwind |
| API | NestJS — prefijo `/api` |
| Auth cliente | `/api/store/auth/*`, perfil `/api/store/me` |

## Requisitos

- Node 20+
- pnpm
- API en ejecución (`pnpm start:dev` en `factosys-store-api`)
- PostgreSQL y variables de la API configuradas

## Configuración

```bash
cp .env.example .env
pnpm install
```

**Puertos (evitar conflicto con la API):**

| Servicio | URL |
|----------|-----|
| API NestJS | `http://localhost:3000` |
| Este frontend | `http://localhost:3001` |

En la API (`.env.development`):

```env
FRONTEND_URL=http://localhost:3001
```

En este proyecto (`.env`):

```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Desarrollo

```bash
pnpm dev
```

Abre `http://localhost:3001`.

## Rutas alineadas con la API

| Ruta web | API / flujo |
|----------|-------------|
| `/registro` | `POST /api/store/auth/register` |
| `/verify-email?token=` | `POST /api/store/auth/verify-email` (enlace del correo) |
| `/login` | `POST /api/store/auth/login` |
| `/auth/google/callback` | Redirect OAuth con `accessToken` y `refreshToken` |
| `/cuenta` | `GET /api/store/me` |

Google: enlace directo a `{API}/api/store/auth/google`.

## Cliente HTTP

Las peticiones a la API usan **`$fetch.create()`** (ofetch, integrado en Nuxt), centralizado en `useApi`: Bearer, refresh en 401 y errores `ApiError`.

## Estructura modular

```text
app/
├── assets/          # Estilos globales
├── components/
│   ├── layout/      # Header, AuthCard
│   └── ui/          # Button, Input, Alert
├── composables/     # useApi ($fetch/ofetch), useApiErrorMessage
├── layouts/         # default, auth
├── middleware/      # auth, guest
├── pages/           # Rutas de la tienda
├── plugins/         # Hidratación de sesión
├── stores/          # Pinia auth
└── types/           # Tipos API y auth
```

## Scripts

```bash
pnpm dev       # Desarrollo (puerto 3001)
pnpm build     # Build producción
pnpm preview   # Vista previa del build
```

## Prueba rápida de auth

1. API: `pnpm db:migrate && pnpm db:seed && pnpm start:dev`
2. Web: `pnpm dev`
3. Registro en `/registro` → verificar en `/verify-email?token=...`
4. Login en `/login` o Google (si `GOOGLE_CLIENT_*` está en la API)

Swagger API: `http://localhost:3000/docs`
