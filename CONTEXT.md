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
| `/motos/[slug]` | Detalle de moto | Generacion estatica + mezcla Sanity/Promobility |
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
- En top de pagina se muestra transparente con linea inferior blanca.
- Al hacer scroll mantiene fondo con blur y animacion de linea inferior.
- **z-index: 9999** para quedar siempre por encima de todo, incluida la interna de motos.
- El mega menu tiene **z-index: 9998**.
- **Mega menu desktop**: full-width, se abre al hacer hover sobre "Modelos". Muestra grid de motos con foto (`fotoHeader`) y nombre. Cambia el logo a version oscura cuando esta abierto. Usa `motoNavQuery` para obtener las motos.
- **Menu mobile**: overlay pantalla completa con **z-index: 10000** (por encima del header). Tiene dos paneles deslizantes:
  - Panel principal: lista de links (Modelos, Concesionarios, Noticias, Concesionarios mas cercanos).
  - Panel Modelos: desliza horizontalmente, muestra lista de motos con foto y nombre, boton volver.
  - Barra superior con logo oscuro y boton cerrar (X).
  - Bloquea el scroll del body mientras esta abierto.
- **Importante**: el `#mobile-menu` esta renderizado **fuera del `<header>`** en el DOM para evitar que `backdrop-filter` del header lo atrape como containing block (lo que romperia `position: fixed`).
- Queries usadas: `motoNavQuery` (motos con `fotoHeader`).

### Hero
- Usa `heroSlide` desde Sanity.
- Soporta imagen desktop y mobile.
- Preload LCP se genera desde `src/pages/index.astro` y se pasa a `BaseLayout`.
- Slider manual sin librerias externas.
- Usa `scroll-snap` e `IntersectionObserver`.
- Soporta 3 estilos administrables desde Sanity:
  - titulo izquierda, detalle derecha
  - titulo derecha, detalle izquierda
  - titulo centrado, sin detalle
- El alineamiento del boton se adapta automaticamente al estilo del slide.
- Tiene animaciones de entrada y hover mejorado en botones rojos.

### MotoSlider
- Consulta motos desde Sanity usando `apiMotoId` e `imagenSliderHome`.
- Cruza esos datos con Promobility para obtener nombre y precios.
- La imagen del card viene desde Sanity.
- `Cotizar` esta solo visual por ahora.
- `Ver modelo` apunta a `/motos/[slug]`.
- Slider manual sin libreria externa.
- Si `bono` es `0`, no muestra precio lista tachado.
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
- En desktop usa sticky scroll para el contenido y efecto parallax en el fondo.
- El contenido queda recortado dentro del panel con `clip-path` para no invadir la seccion siguiente.

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
- Cards ajustadas para menor altura visual respecto al primer mockup.

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
- Desktop y mobile: feed en grilla 2x2.
- La imagen inferior tiene overlay tipo InfoSection.

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
- Links del footer usan hover con subrayado animado, alineado visualmente con el header.

## Interna de motos actual

### Hero secuencial
- La pagina `/motos/[slug]` mezcla datos editoriales de Sanity con datos comerciales y tecnicos de Promobility.
- Si la moto tiene `scrollSequenceFrames`, se activa un hero secuencial con animacion por scroll.
- La secuencia usa exactamente 13 imagenes desde 0 a 30 grados.
- El hero inicial muestra:
  - nombre de la moto
  - precio lista
  - precio bono
  - boton de cotizacion
  - iconos inferiores derechos administrables desde Sanity
- El estado final del hero muestra:
  - colores disponibles desde la API
  - specs principales desde la API
  - nombre de la moto y CTA final
- Usa imagen de fondo estatica local en `public/moto/hero.webp`.

### Selector de colores (hero secuencial)
- Los colores vienen de Promobility API (`apiModel.colors`).
- Se renderizan en una lista vertical a la izquierda con curvatura tipo arco.
- Cada `<li>` recibe `--item-index` y `--item-total` como CSS custom properties desde el HTML.
- El posicionamiento es **100% dinamico via CSS**: `top` y `left` se calculan con `calc()` usando esas variables. Funciona para cualquier cantidad de colores (1 a 6).
- Formula de curvatura: `left = 2.05rem × 2 × abs(index − total/2) / total` (indent maximo en extremos, 0 en el centro).
- Con un solo color: `:only-child` lo centra verticalmente con `top: 50%; left: 0`.
- Al seleccionar un color, se intercambia la imagen de la moto usando imagenes de Sanity (`colores[].imagen`) cruzadas por nombre con los colores de la API.

### Secciones editoriales de moto
- `moto-info`: seccion de zona informativa con `height: 100dvh`. El contenido (`.moto-info__container`) esta centrado verticalmente con `height: 100%` y `items-center`.
- `caracteristicasAdicionales` se renderiza con grilla de imagenes, titulo y detalle.
- `fichaTecnica` se expone mediante boton hacia el PDF.
- `zonaInformativa` se renderiza debajo de caracteristicas.
- `tituloGaleria` y `galeriaFotos` existen a nivel schema y en la pagina.
- `ctaFinal` renderiza el componente `MotoCta` solo si `ctaFinal.imagenFondo.asset._ref` existe (guarda defensiva para evitar error de `urlFor` cuando la imagen no esta asignada en el CMS).

### MotoCta
- Componente `src/components/motos/MotoCta.astro`.
- Seccion CTA con animacion scroll-driven nativa (CSS puro, cero JS).
- Efecto "pin & scrub": imagen se achica en perspectiva, titulo aparece desde abajo, luego emerge el boton CTA.
- Tecnica: `view-timeline`, `animation-timeline`, `animation-range`, `position: sticky`.
- Compatible con `@supports (animation-timeline: scroll())`. Si no soporta: version estatica. Con `prefers-reduced-motion`: estado final directo.
- **Guarda defensiva**: lanza error descriptivo si `imagenFondo.asset._ref` esta ausente, para detectar rapido cuando falta asignar imagen en el CMS.
- En `[slug].astro` la condicion de render es `ctaFinal?.imagenFondo?.asset?._ref` (no basta con que el objeto exista).

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
| `heroSlide` | Activo | Hero principal con desktop/mobile y 3 estilos |
| `moto` | Reestructurado | Capa editorial para cruce con API + interna de motos |
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
- `scrollSequenceFrames`
- `imagenSliderHome`
- `zonaInformativa`
- `colores`
- `caracteristicasAdicionales`
- `fichaTecnica`
- `tituloGaleria`
- `galeriaFotos`

Notas:
- `heroImagenes` ahora corresponde a los iconos del hero de la interna.
- `scrollSequenceFrames` exige 13 imagenes exactas, cada una con alt y opcion mobile.
- `zonaInformativa` tiene titulo, descripcion e imagen de fondo con version mobile.

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
- `motoNavQuery` — motos con `fotoHeader` para el mega menu y menu mobile del header
- `motosConFotoOfertaQuery` — motos con `fotoOferta`, fallback cuando no hay entradas en Home-Oferta

## Tipos TypeScript relevantes
Archivo: `src/lib/types.ts`

Tipos importantes:
- `SanityImage`
- `SanityFile`
- `Post`
- `Author`
- `HeroStat`
- `HeroSlide`
- `MotoSpec`
- `MotoScrollSequenceFrame`
- `MotoAdditionalFeature`
- `MotoInfoSection`
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
- Fuentes servidas localmente para evitar bloqueo por Google Fonts.
- Header con estado blur manejado en cliente sin librerias externas.
- Hero del home e interna de motos usan transiciones y animaciones manuales, evitando librerias pesadas.

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
- Seguir puliendo la interna de moto, especialmente detalles responsive y acabados del hero secuencial.
- Evaluar webhook Sanity -> Cloudflare Pages para que los cambios editoriales disparen deploy automatico.
- Revisar si conviene migrar a SSR para precios/contenido en tiempo real.
- Asignar imagen de fondo CTA (`ctaFinal.imagenFondo`) en las motos que aun no la tienen en Sanity.

## Gotchas y decisiones tecnicas importantes

### backdrop-filter y position: fixed
`backdrop-filter` en un ancestro crea un nuevo containing block para `position: fixed`, haciendo que `inset: 0` se calcule relativo al ancestro y no al viewport. Por eso el `#mobile-menu` esta renderizado **fuera del `<header>`**, aunque sea parte del componente `Header.astro`.

### urlFor de Sanity sin asset
Si un campo de imagen en Sanity tiene `alt` pero no tiene imagen asignada, el objeto llega sin `asset._ref`. Llamar `urlFor()` sobre ese objeto lanza un error fatal. La convencion del proyecto es siempre verificar `?.asset?._ref` antes de renderizar o llamar `urlFor`.

### Selector de colores dinamico
Los colores de la API se renderizan con CSS custom properties `--item-index` y `--item-total` inyectadas en cada `<li>`. El posicionamiento (top + curvatura lateral) se calcula enteramente con `calc()` en CSS, sin JS. Esto permite que funcione con cualquier cantidad de colores de 1 a 6 sin tocar CSS.
