# Factosys Store Web

Frontend de la tienda (Nuxt 4 + Vue 3 + Tailwind) integrado con [factosys-store-api](https://github.com/SantosSjba/factosys-store-api).

## Arquitectura

| Capa | Tecnología |
|------|------------|
| Frontend tienda | Nuxt 4, Vue 3, TypeScript, Tailwind |
| HTTP | **Axios** (`useApi` / `useAdminApi`) |
| Datos remotos | **TanStack Query** (queries + mutations) |
| Estado sesión | Pinia |
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
NUXT_PUBLIC_API_BASE_URL=/api
NUXT_API_PROXY_TARGET=https://127.0.0.1:3000
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
| `/verify-email?token=` | `POST /api/store/auth/verify-email` |
| `/login` | `POST /api/store/auth/login` |
| `/auth/google/callback` | Redirect OAuth con `accessToken` y `refreshToken` |
| `/cuenta` | `GET /api/store/me` |
| `/intranet/login` | `POST /api/admin/auth/login` |

Google: enlace directo a `{API}/api/store/auth/google`.

## Cliente HTTP y datos

- **Axios** en `useApi` (tienda) y `useAdminApi` (intranet): Bearer, refresh automático en 401, errores como `ApiError`.
- **Servicios** en `app/api/*.api.ts` — una función por endpoint.
- **TanStack Query**: mutaciones de auth (`useStoreLoginMutation`, etc.) y queries de perfil (`useStoreProfileQuery`).
- **Pinia** guarda tokens y sesión; las queries sincronizan perfil al cachear.

## Estructura modular

```text
app/
├── api/             # Llamadas HTTP por dominio (store-auth, store-profile…)
├── composables/
│   ├── mutations/   # TanStack mutations (auth)
│   ├── queries/     # TanStack queries (perfil)
│   ├── useApi.ts    # Cliente Axios tienda
│   └── useAdminApi.ts
├── constants/       # query-keys
├── components/
├── plugins/         # vue-query, hidratación auth
├── stores/          # Pinia (sesión)
└── utils/           # create-axios-client, parse-api-error
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
