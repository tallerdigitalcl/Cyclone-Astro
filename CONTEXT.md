# Contexto del Proyecto - Cyclone Motos

## Descripcion general
Sitio web para **Cyclone Motos**, marca de motocicletas. Esta base se esta construyendo para poder reutilizarla en otras marcas relacionadas, por lo que la identidad visual esta centralizada en variables CSS globales en `src/styles/variables.css`.

La arquitectura actual separa claramente:
- **Sanity** para contenido editorial y assets
- **Promobility API** para datos comerciales y dinamicos de motos
- **Astro** para renderizado server-side y generacion estatica

## Stack tecnologico
- **Frontend**: Astro 5 + TypeScript
- **CMS**: Sanity Studio v3 en `/studio`
- **Estilos**: Tailwind CSS 3 + variables CSS globales
- **Convencion CSS**: BEM + `@apply` dentro de bloques `<style>`
- **Imagenes**: Sanity CDN
- **Deployment objetivo**: Cloudflare Pages

## Comandos de desarrollo
```bash
# Sitio principal
npm run dev
npm run build

# Sanity Studio
cd studio
npm run dev
npm run build
```

## Variables de entorno
Archivo raiz `.env`:
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PROMOBILITY_API_BASE_URL`
- `PROMOBILITY_API_SITE_ID`
- `PROMOBILITY_API_ORIGIN`
- `PROMOBILITY_API_TOKEN`

## Estructura de paginas

| Ruta | Descripcion | Estado |
|---|---|---|
| `/` | Home | En desarrollo, conectado a Sanity |
| `/motos` | Catalogo de motos | Conectado a Sanity |
| `/motos/[slug]` | Detalle de moto | Generacion estatica |
| `/blog` | Listado de noticias | Existente |
| `/blog/[slug]` | Articulo individual | Existente |

## Home actual

| # | Componente | Estado | Fuente de datos |
|---|---|---|---|
| 1 | `Header` | Completo | Hardcoded |
| 2 | `Hero` | Completo | Sanity |
| 3 | `MotoSlider` | Completo | Sanity + Promobility API |
| 4 | `InfoSection` | Completo | Sanity |
| 5 | `MotosOferta` | Placeholder | Pendiente |
| 6 | `InstagramSection` | Placeholder | Pendiente |
| 7 | `LatestNews` | Placeholder/base | Sanity |
| 8 | `Footer` | Completo | Hardcoded por ahora |

## Cambios recientes importantes

### 1. Sistema de marca y tipografia
- La paleta y tipografia base fueron actualizadas en `src/styles/variables.css`
- La tipografia ahora usa **Roboto** para headings y **Manrope** para body
- La escala tipografica esta centralizada en variables (`--text-h1`, `--text-h2`, etc.)
- Tailwind expone estas variables con utilidades como `text-h1`, `text-h2`, `font-heading`, `font-body`

### 2. Hero
- Usa `imagenMobile` correctamente cuando existe en Sanity
- Mantiene preload de la imagen LCP desde `BaseLayout`
- Slider manual con scroll snap, sin libreria externa

### 3. MotoSlider (segunda seccion del home)
- Ya no es placeholder
- Consulta motos desde Sanity usando:
  - `apiMotoId`
  - `imagenSliderHome`
- Cruza esos datos con Promobility API para obtener:
  - `modelo`
  - `precio`
  - `precio_lista`
- La imagen de fondo del card viene desde Sanity
- `Cotizar` esta solo visual por ahora
- `Ver modelo` apunta a `/motos/[slug]`
- Slider implementado manualmente, sin libreria externa
- Responsive:
  - mobile: una card por vista
  - tablet: cards mas amplias
  - desktop: dos cards por viewport
- El fondo de la seccion usa una franja inferior con gradiente azul

### 4. InfoSection (tercera seccion visual despues del slider)
- Ya no es placeholder
- Es administrable desde Sanity
- Permite:
  - titulo
  - descripcion
  - boton
  - imagen de fondo
  - alt obligatorio
- La imagen ocupa todo el ancho de la pagina

### 5. Footer
- Ya fue construido
- Tiene:
  - barra superior de redes
  - columnas de navegacion
  - newsletter visual
  - cierre legal

## Integracion con Promobility API
Archivo clave: `src/lib/promobility.ts`

Responsabilidades:
- consultar el endpoint de Promobility server-side
- usar `id_web` desde `.env`
- enviar `Authorization: Bearer ...`
- enviar header `Origin`
- normalizar precios para el frontend
- construir el arreglo final para el slider del home

### Endpoint validado
Se valido la consulta con:
- `id_web=6`
- `id_vehiculo=51`

La respuesta trae, entre otros:
- `id`
- `modelo`
- `marca`
- `precio`
- `precio_lista`
- `bono`
- `colors`

## Schemas de Sanity

| Schema | Estado | Notas |
|---|---|---|
| `post` | Activo | Blog |
| `author` | Activo | Ahora con `alt` obligatorio en imagen |
| `blockContent` | Activo | Rich text con imagenes |
| `heroSlide` | Activo | Hero principal |
| `moto` | Reestructurado | Pensado para cruce con API |
| `homeInfoSection` | Nuevo | Seccion administrable del home |

### Schema `moto`
El schema `moto` ya no esta pensado como fuente de precio. Ahora funciona como capa editorial para mezclar con la API.

Campos principales actuales:
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

### Regla global de imagenes en Sanity
Toda imagen administrable debe:
- permitir `alt`
- exigir `alt` para SEO/accesibilidad
- aceptar solo `webp` o `avif` cuando corresponde a los nuevos campos definidos

Campos nuevos de imagen en `moto` y `homeInfoSection` ya siguen esta regla.

## Queries GROQ actuales
Archivo: `src/lib/queries.ts`

Principales exports:
- `postsQuery`
- `postBySlugQuery`
- `allSlugsQuery`
- `motosQuery`
- `motosOfertaQuery`
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

## Optimizaciones de rendimiento y SEO aplicadas
- preload del logo del header en `BaseLayout`
- preload dinamico del hero LCP
- uso de `width` y `height` en imagenes clave
- `srcset` y `sizes` en Hero, MotoSlider e InfoSection
- `alt` obligatorio en imagenes administrables nuevas
- slider del hero y slider de motos sin librerias externas
- consumo de Promobility desde el servidor, no desde el cliente
- cruce Sanity + API antes del render del home

## Convenciones del proyecto
- `src/components/layout/` para layout global
- `src/components/home/` para secciones del home
- `src/components/motos/` para componentes de motos
- `src/components/ui/` para piezas reutilizables
- `src/lib/queries.ts` para GROQ
- `src/lib/types.ts` para tipos
- `src/lib/sanity.ts` para cliente Sanity
- `src/lib/promobility.ts` para integracion con API externa

## Pendiente
- conectar `Cotizar` con flujo real
- implementar `MotosOferta`
- implementar `InstagramSection`
- completar `LatestNews`
- actualizar queries y tipos de detalle de moto al nuevo schema editorial
- construir la interna completa de moto usando:
  - Sanity para contenido editorial
  - Promobility para precio/datos comerciales
- configurar deployment final en Cloudflare Pages
- revisar CORS/dominios finales de Sanity
