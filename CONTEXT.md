# Contexto del Proyecto - Cyclone Motos

## Descripcion general
Sitio web para **Cyclone Motos**, marca de motocicletas. La base esta pensada para poder reutilizarse en otras marcas relacionadas, por lo que la identidad visual esta centralizada en variables CSS globales y tokens consumidos por Tailwind.

La arquitectura actual separa responsabilidades:
- **Sanity**: contenido editorial, textos, imagenes y documentos administrables.
- **Promobility API**: datos comerciales dinamicos de motos, como nombre, precio lista, bono y precio.
- **Astro**: generacion estatica del sitio y render server-side durante build.
- **Cloudflare Pages**: hosting del frontend.

## Stack tecnologico
- **Frontend**: Astro 5 + TypeScript
- **CMS**: Sanity Studio v3 en `/studio`
- **Estilos**: Tailwind CSS 3 + variables CSS globales
- **Convencion CSS**: BEM + `@apply` dentro de bloques `<style>`
- **Imagenes administrables**: Sanity CDN
- **Imagenes estaticas**: carpeta `public`
- **Deployment frontend**: Cloudflare Pages
- **Deployment Studio**: Sanity-hosted Studio en `cyclone-motos-cl.sanity.studio`

## Comandos de desarrollo
```bash
# Sitio principal
npm run dev
npm run build

# Sanity Studio
cd studio
npm run dev
npm run build
npx sanity deploy
```

Para desplegar el Studio con token:
```powershell
$env:SANITY_AUTH_TOKEN='TOKEN_CON_PERMISO_DEPLOY_STUDIO'
npx sanity deploy
```

## Variables de entorno
Archivo raiz `.env` y Cloudflare Pages:
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PROMOBILITY_API_BASE_URL`
- `PROMOBILITY_API_SITE_ID`
- `PROMOBILITY_API_ORIGIN`
- `PROMOBILITY_API_TOKEN`

Sanity Studio:
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_HOST`
- `SANITY_AUTH_TOKEN` solo para deploy local cuando corresponda

## Estructura de paginas

| Ruta | Descripcion | Estado |
|---|---|---|
| `/` | Home | Conectado a Sanity + Promobility |
| `/motos` | Catalogo de motos | Conectado a Sanity |
| `/motos/[slug]` | Detalle de moto | Generacion estatica |
| `/noticia` | Listado de noticias | Conectado a Sanity |
| `/noticia/[slug]` | Noticia individual | Generacion estatica |

Nota: la ruta antigua `/blog` fue reemplazada por `/noticia`.

## Home actual

| # | Componente | Estado | Fuente de datos |
|---|---|---|---|
| 1 | `Header` | Completo | Hardcoded |
| 2 | `Hero` | Completo | Sanity |
| 3 | `MotoSlider` | Completo | Sanity + Promobility API |
| 4 | `InfoSection` | Completo | Sanity |
| 5 | `MotosOferta` | Completo | Sanity + Promobility API |
| 6 | `InstagramSection` | Completo temporal | Imagenes estaticas desde `public` |
| 7 | `LatestNews` | Completo | Sanity |
| 8 | `Footer` | Completo | Hardcoded por ahora |

## Identidad visual y tipografia
- La paleta vive en `src/styles/variables.css`.
- Tailwind expone los tokens desde `tailwind.config.cjs`.
- Headings usan **Roboto**.
- Body usa **Manrope**.
- Las fuentes estan autohospedadas en `public/fonts`.
- Se eliminaron dependencias de Google Fonts para mejorar PageSpeed.
- La escala tipografica usa variables como `--text-h1`, `--text-h2`, `--text-body`, etc.
- Las utilidades principales son `font-heading`, `font-body`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-body-lg`, `text-body-sm`.

## Componentes principales

### Header
- Navegacion principal hardcoded.
- La ruta de noticias apunta a `/noticia`.
- Tiene gradiente vertical negro desde arriba.

### Hero
- Usa `heroSlide` desde Sanity.
- Soporta imagen desktop y mobile.
- Preload LCP se genera desde `src/pages/index.astro` y se pasa a `BaseLayout`.
- Slider manual sin librerias externas.
- Usa `scroll-snap` e `IntersectionObserver`.

### MotoSlider
- Consulta motos desde Sanity usando `apiMotoId` e `imagenSliderHome`.
- Cruza esos datos con Promobility para obtener nombre y precios.
- La imagen del card viene desde Sanity.
- `Cotizar` esta solo visual por ahora.
- `Ver modelo` apunta a `/motos/[slug]`.
- Slider manual sin libreria externa.
- Responsive:
  - mobile: una card por vista.
  - tablet: cards mas amplias.
  - desktop: dos cards por viewport.
- Fondo con franja inferior azul en gradient, ajustado por breakpoints.

### InfoSection
- Administrable desde Sanity con `homeInfoSection`.
- Campos:
  - titulo
  - descripcion
  - texto del boton
  - URL del boton
  - imagen de fondo desktop
  - imagen mobile dentro de `mobileImage`
  - alt obligatorio
- La imagen ocupa todo el ancho.
- Tiene overlay de negro a transparente desde abajo hacia arriba.
- Usa `<picture>` para servir mobile en pantallas pequenas.

### MotosOferta
- Administrable desde Sanity con schema `oferta`.
- Cada oferta guarda:
  - `apiMotoId`
  - imagen de fondo desktop
  - imagen mobile dentro de `mobileImage`
  - alt obligatorio
  - `orden`
- Precio lista y bono vienen desde Promobility.
- Desktop: layout tipo grid.
- Mobile: slider horizontal con `scroll-snap`.
- Dots mobile con area tactil suficiente para PageSpeed.
- Dots sincronizados con `IntersectionObserver`.

### InstagramSection
- Implementacion temporal mientras se conecta Meta API.
- Usa imagenes estaticas desde:
  - `public/home/instagram/feed/post-01.avif`
  - `public/home/instagram/feed/post-02.avif`
  - `public/home/instagram/feed/post-03.avif`
  - `public/home/instagram/feed/post-04.avif`
  - `public/home/instagram/feature/instagram-feature.avif`
- La zona superior tiene gradient manual.
- La imagen grande inferior es independiente.
- Desktop: grid.
- Mobile: scroll horizontal con `scroll-snap`.

### LatestNews
- Seccion final del home.
- Usa el schema `post`, titulado como **Noticias** en Sanity.
- Renderiza las ultimas 5 noticias.
- Usa:
  - titulo para home
  - extracto
  - categoria
  - imagen destacada para home
- Los links apuntan a `/noticia/[slug]`.

### Footer
- Completo.
- Tiene barra superior de redes.
- Columnas de navegacion.
- Newsletter visual sin backend por ahora.
- Lista social corregida semanticamente con `ul/li`.

## Integracion con Promobility API
Archivo clave: `src/lib/promobility.ts`

Responsabilidades:
- consultar Promobility server-side durante build.
- usar `PROMOBILITY_API_SITE_ID`.
- enviar `Authorization: Bearer ...`.
- enviar header `Origin`.
- normalizar precios a formato chileno con puntos.
- construir datos finales para `MotoSlider`.
- construir datos finales para `MotosOferta`.

Endpoint validado:
- `id_web=6`
- `id_vehiculo=51`

La API devuelve datos como:
- `id`
- `modelo`
- `marca`
- `precio`
- `precio_lista`
- `bono`
- `colors`

Importante:
- El sitio hoy es estatico.
- Si cambian precios o contenido en Sanity, se debe hacer redeploy en Cloudflare Pages para reflejarlo.
- Si se quiere contenido/precios en tiempo real, habria que evaluar SSR o un webhook de deploy.

## Schemas de Sanity

| Schema | Estado | Notas |
|---|---|---|
| `post` | Reestructurado | Se muestra como Noticias |
| `author` | Activo | Imagen con alt |
| `blockContent` | Activo | Rich text con imagenes webp/avif y alt |
| `heroSlide` | Activo | Hero principal con desktop/mobile |
| `moto` | Reestructurado | Capa editorial para cruce con API |
| `homeInfoSection` | Activo | InfoSection del home |
| `oferta` | Activo | Ofertas del home |

### Schema `post` / Noticias
Campos obligatorios:
- `title`: titulo de noticia para interna.
- `homeTitle`: titulo de noticia en el home.
- `slug`: URL.
- `category`: `tips`, `eventos`, `nuevo`.
- `excerpt`: extracto para home y SEO.
- `homeImage`: imagen destacada para el home, con alt y mobile.

Campos opcionales:
- `heroImages`: slider de imagenes hero.
- `body`: contenido completo de la noticia.
- `galleryPhotos`: galeria de fotos.
- `publishedAt`: fecha de publicacion.

### Schema `moto`
Funciona como capa editorial para mezclar con datos comerciales de la API.

Campos principales:
- `nombre`
- `apiMotoId`
- `slug`
- `tituloDescriptivo`
- `descripcion`
- `heroImagenes`
- `imagenSliderHome`
- `colores`
- `caracteristicasAdicionales`
- `fichaTecnica`
- `tituloGaleria`
- `galeriaFotos`

### Schema `oferta`
Campos:
- `apiMotoId`
- `imagenFondo`
- `orden`

El nombre, precio lista y bono se obtienen desde Promobility.

## Regla global de imagenes en Sanity
Toda imagen administrable nueva debe:
- permitir `alt`.
- exigir `alt` para SEO y accesibilidad.
- aceptar solo `webp` o `avif`.
- permitir version mobile cuando aplique mediante `mobileImage`.

El helper esta en:
- `studio/schemas/imageFields.ts`

## Queries GROQ actuales
Archivo: `src/lib/queries.ts`

Exports principales:
- `postsQuery`
- `postBySlugQuery`
- `allSlugsQuery`
- `motosQuery`
- `ofertasHomeQuery`
- `motosHomeSliderQuery`
- `motoBySlugQuery`
- `allMotoSlugsQuery`
- `heroSlidesQuery`
- `homeInfoSectionQuery`

## Tipos TypeScript relevantes
Archivo: `src/lib/types.ts`

Tipos importantes:
- `SanityImage`
- `Post`
- `HeroSlide`
- `Moto`
- `PromobilityMotoModel`
- `PromobilityMotoColor`
- `HomeSliderMoto`
- `HomeInfoSection`
- `Oferta`
- `HomeOffer`

## Optimizaciones de rendimiento y SEO aplicadas
- CSS pequeno inlineado con `inlineStylesheets: 'always'`.
- Fuentes autohospedadas y preloaded desde `BaseLayout`.
- Se eliminaron Google Fonts externos.
- Preload dinamico del hero LCP.
- Uso de `width` y `height` en imagenes clave.
- Uso de `<picture>`, `srcset` y `sizes` en secciones principales.
- Imagenes administrables con `alt`.
- Sliders manuales sin librerias externas.
- `MotosOferta` usa `IntersectionObserver` para dots en mobile.
- Promobility se consume en servidor durante build, no desde el cliente.
- Se corrigio la semantica ARIA del footer.

## Flujo de deploy

### Frontend en Cloudflare Pages
Config:
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

Variables necesarias:
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PROMOBILITY_API_BASE_URL`
- `PROMOBILITY_API_SITE_ID`
- `PROMOBILITY_API_ORIGIN`
- `PROMOBILITY_API_TOKEN`

### Sanity Studio
Para subir cambios de schema al Studio publicado:
```powershell
cd studio
$env:SANITY_AUTH_TOKEN='TOKEN_DEPLOY_STUDIO'
npx sanity deploy
```

## Convenciones del proyecto
- `src/components/layout/` para layout global.
- `src/components/home/` para secciones del home.
- `src/components/motos/` para componentes de motos.
- `src/components/ui/` para piezas reutilizables.
- `src/pages/noticia/` para listado e interna de noticias.
- `src/lib/queries.ts` para GROQ.
- `src/lib/types.ts` para tipos.
- `src/lib/sanity.ts` para cliente Sanity.
- `src/lib/promobility.ts` para integracion con API externa.

## Pendientes conocidos
- Conectar `Cotizar` con flujo real.
- Conectar `InstagramSection` con Meta API.
- Actualizar la interna completa de moto al nuevo schema editorial.
- Mejorar detalle de moto mezclando Sanity + Promobility.
- Crear webhook Sanity -> Cloudflare Pages si se quiere redeploy automatico al publicar contenido.
- Revisar si conviene migrar a SSR para precios/contenido en tiempo real.
