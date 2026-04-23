# Guía de configuración: Astro + Sanity CMS

Esta guía te lleva paso a paso desde cero hasta tener el sitio publicado y el cliente administrando contenido.

---

## Requisitos previos

- Node.js 18+ instalado
- Cuenta en [sanity.io](https://sanity.io) (gratis)
- Cuenta en [Cloudflare](https://cloudflare.com) (gratis) para el hosting

---

## Paso 1 — Crear el proyecto en Sanity

1. Ve a [sanity.io](https://sanity.io) y crea una cuenta (puedes usar GitHub, Google o email).
2. Desde el dashboard, haz clic en **"New project"**.
3. Ponle un nombre al proyecto (ej: `Astro Cyclone`).
4. Elige **"Create new dataset"** → deja el nombre `production` y visibilidad **Public**.
5. Anota el **Project ID** que aparece en la URL: `https://www.sanity.io/manage/personal/project/XXXXXXXX`

---

## Paso 2 — Configurar variables de entorno

### Sitio Astro (carpeta raíz del proyecto):

```bash
# En la raíz del proyecto
cp .env.example .env
```

Edita el archivo `.env` con el Project ID que anotaste:

```env
PUBLIC_SANITY_PROJECT_ID=tu_project_id_aqui
PUBLIC_SANITY_DATASET=production
```

### Sanity Studio (carpeta `studio/`):

```bash
cd studio
cp .env.example .env
```

Edita `studio/.env`:

```env
SANITY_STUDIO_PROJECT_ID=tu_project_id_aqui
SANITY_STUDIO_DATASET=production
```

---

## Paso 3 — Instalar dependencias

Necesitas instalar en dos lugares: el sitio Astro y el Studio.

```bash
# 1. Dependencias del sitio Astro (desde la raíz)
npm install

# 2. Dependencias del Studio
cd studio
npm install
cd ..
```

---

## Paso 4 — Inicializar el Studio con tu cuenta

```bash
cd studio
npx sanity login        # Inicia sesión en tu cuenta Sanity
npx sanity init --reconfigure   # Vincula el proyecto
```

Cuando se muestre la lista de proyectos, selecciona el que creaste en el Paso 1.

---

## Paso 5 — Ejecutar en modo desarrollo

Necesitarás **dos terminales** abiertas:

**Terminal 1 — Sanity Studio:**
```bash
cd studio
npm run dev
# Abre http://localhost:3333
```

**Terminal 2 — Sitio Astro:**
```bash
# Desde la raíz del proyecto
npm run dev
# Abre http://localhost:4321
```

En el Studio puedes crear Autores y Entradas. El sitio Astro los mostrará automáticamente.

---

## Paso 6 — Crear el primer contenido de prueba

1. Abre el Studio en `http://localhost:3333`
2. Ve a **"Autor"** → crea un autor con tu nombre
3. Ve a **"Entrada"** → crea una entrada de prueba:
   - Título: `Mi primera entrada`
   - Slug: haz clic en **"Generate"**
   - Autor: selecciona el que creaste
   - Extracto: una descripción breve
   - Fecha: hoy
   - Contenido: escribe algo
4. Haz clic en **"Publish"**
5. Refresca el sitio en `http://localhost:4321/blog` — la entrada aparecerá

---

## Paso 7 — Desplegar el Studio para el cliente

El cliente necesita acceder al panel de administración desde internet. Sanity ofrece hosting gratuito:

```bash
cd studio
npm run deploy
```

Se te pedirá elegir un nombre para la URL (ej: `astro-cyclone`).
El Studio quedará disponible en: **`https://astro-cyclone.sanity.studio`**

> El cliente solo necesita la URL del Studio. No necesita instalar nada.

---

## Paso 8 — Invitar al cliente

1. Ve a [sanity.io/manage](https://www.sanity.io/manage)
2. Selecciona tu proyecto
3. Ve a **"Members"** → **"Invite members"**
4. Ingresa el email del cliente
5. Asigna el rol **"Editor"**:
   - Puede crear, editar y publicar contenido
   - **No puede** modificar schemas ni configuración del proyecto

> El cliente recibirá un email de invitación. Al aceptarlo, podrá acceder al Studio con su propia cuenta.

---

## Paso 9 — Desplegar el sitio Astro en Cloudflare Pages

### Opción A — Desde GitHub (recomendado):

1. Sube el proyecto a un repositorio de GitHub
2. Ve a [Cloudflare Pages](https://pages.cloudflare.com/) → **"Create a project"** → **"Connect to Git"**
3. Selecciona tu repositorio
4. Configura el build:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. En **"Environment variables"**, agrega:
   | Variable | Valor |
   |---|---|
   | `PUBLIC_SANITY_PROJECT_ID` | tu project ID |
   | `PUBLIC_SANITY_DATASET` | `production` |
6. Haz clic en **"Save and Deploy"**

### Opción B — Desde la CLI:

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist
```

---

## Paso 10 — Configurar CORS en Sanity

Para que el sitio en producción pueda leer datos de Sanity, debes agregar tu dominio:

1. Ve a [sanity.io/manage](https://www.sanity.io/manage) → tu proyecto → **"API"** → **"CORS Origins"**
2. Agrega tus dominios:
   - `http://localhost:4321` (desarrollo)
   - `https://tu-proyecto.pages.dev` (Cloudflare preview)
   - `https://tu-dominio.com` (producción, cuando tengas dominio propio)
3. Marca la casilla **"Allow credentials"** si usas autenticación

---

## Paso 11 — Webhooks: reconstruir al publicar contenido

Configura un webhook para que el sitio se actualice automáticamente cuando el cliente publique o edite contenido.

**En Cloudflare Pages:**
1. Ve a tu proyecto → **"Settings"** → **"Builds & deployments"** → **"Deploy hooks"**
2. Crea un hook con el nombre `Sanity Publish` y copia la URL generada

**En Sanity:**
1. Ve a [sanity.io/manage](https://www.sanity.io/manage) → tu proyecto → **"API"** → **"Webhooks"**
2. Haz clic en **"Add webhook"** y configura:
   - **Name:** `Cloudflare Pages Deploy`
   - **URL:** la URL del deploy hook de Cloudflare
   - **Dataset:** `production`
   - **Trigger on:** ✅ Create, ✅ Update, ✅ Delete
   - **Filter:** `_type == "post"` (solo rebuilds al publicar entradas)
   - **HTTP method:** `POST`
3. Guarda el webhook

A partir de ahora, cada vez que el cliente publique una entrada, Cloudflare reconstruirá el sitio automáticamente en ~1-2 minutos.

---

## Actualizar el dominio en el sitio

Cuando tengas tu dominio definitivo, actualiza dos archivos:

**`astro.config.mjs`:**
```js
export default defineConfig({
  site: 'https://tu-dominio-real.com', // ← cambia esto
  // ...
});
```

**`public/robots.txt`:**
```
Sitemap: https://tu-dominio-real.com/sitemap-index.xml
```

---

## Estructura del proyecto

```
astro-cyclone/
├── src/
│   ├── lib/
│   │   ├── sanity.ts        ← Cliente Sanity + función urlFor()
│   │   ├── queries.ts       ← Queries GROQ
│   │   └── types.ts         ← Tipos TypeScript
│   ├── layouts/
│   │   └── BaseLayout.astro ← Layout base con SEO completo
│   ├── components/
│   │   └── PostCard.astro   ← Tarjeta de entrada del blog
│   ├── pages/
│   │   ├── index.astro      ← Página de inicio
│   │   └── blog/
│   │       ├── index.astro  ← Listado del blog
│   │       └── [slug].astro ← Entrada individual
│   └── styles/
│       └── global.css
├── studio/                  ← Panel de administración (Sanity Studio)
│   ├── schemas/
│   │   ├── post.ts          ← Esquema de entradas
│   │   ├── author.ts        ← Esquema de autores
│   │   └── blockContent.ts  ← Editor de texto enriquecido
│   └── sanity.config.ts
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── .env.example             ← Plantilla de variables (copia a .env)
└── astro.config.mjs
```

---

## Comandos de referencia

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el sitio Astro en desarrollo |
| `npm run build` | Construye el sitio para producción |
| `npm run preview` | Previsualiza el build de producción |
| `cd studio && npm run dev` | Inicia el Studio en desarrollo |
| `cd studio && npm run deploy` | Publica el Studio en sanity.studio |

---

## Recursos

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Sanity](https://www.sanity.io/docs)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/groq-cheat-sheet)
- [Astro + Sanity — Guía oficial](https://www.sanity.io/guides/sanity-astro-blog)
- [Cloudflare Pages + Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
