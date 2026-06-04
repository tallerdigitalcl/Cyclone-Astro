# Manual tecnico - Cyclone Motos

Este documento describe el funcionamiento tecnico actual del sitio Cyclone Motos: tecnologias, arquitectura, integraciones, estructura, flujo de publicacion, Sanity CMS, backups y puntos relevantes de mantencion.

## 1. Resumen general

Cyclone Motos es un sitio web construido con Astro, conectado a Sanity como CMS y a la API de Promobility/Track para datos comerciales dinamicos.

La arquitectura separa responsabilidades:

- Astro genera el sitio web, sus paginas, componentes, estilos y HTML final.
- Sanity administra contenido editable, imagenes, noticias, motos, textos y paginas de contenido.
- Promobility/Track entrega datos comerciales: precios, bonos, modelos y concesionarios.
- Cloudflare Pages publica el sitio y ejecuta funciones serverless para endpoints sensibles.
- Sanity Studio entrega el panel de administracion para editar contenido.

## 2. Tecnologias principales

- Frontend: Astro 5.
- Lenguaje: TypeScript.
- Estilos: Tailwind CSS 3, CSS global y CSS por componente.
- CMS: Sanity Studio v3.
- Queries CMS: GROQ.
- Imagenes CMS: Sanity CDN.
- Imagenes estaticas: carpeta `public/`.
- Mapas: Mapbox GL.
- Hosting frontend: Cloudflare Pages.
- Funciones serverless: Cloudflare Pages Functions en `functions/api`.
- Fuentes: Roboto y Manrope autohospedadas en `public/fonts`.
- SEO: metadatos desde `BaseLayout`, sitemap con `@astrojs/sitemap`, canonical URL y Open Graph.

Dependencias principales del sitio:

- `astro`
- `@astrojs/tailwind`
- `@astrojs/sitemap`
- `tailwindcss`
- `@sanity/client`
- `@sanity/image-url`
- `@portabletext/to-html`
- `mapbox-gl`
- `typescript`

Dependencias principales del Studio:

- `sanity`
- `@sanity/vision`
- `react`
- `react-dom`
- `styled-components`
- `typescript`

## 3. Estructura del proyecto

```txt
Astro-Cyclone/
|-- astro.config.mjs
|-- package.json
|-- tailwind.config.cjs
|-- tsconfig.json
|-- CONTEXT.md
|-- SANITY-FUNCIONAMIENTO.md
|-- SANITY-SETUP.md
|-- MANUAL-TECNICO.md
|-- functions/
|   |-- api/
|   |   |-- quote-model.ts
|   |   |-- quote-submit.ts
|   |   |-- quote-financing.ts
|   |   |-- autofin-simulation.ts
|-- public/
|   |-- fonts/
|   |-- footer/
|   |-- header/
|   |-- home/
|   |-- moto/
|-- scripts/
|   |-- test-sucursales.mjs
|-- src/
|   |-- components/
|   |   |-- home/
|   |   |-- layout/
|   |   |-- motos/
|   |   |-- ui/
|   |-- layouts/
|   |   |-- BaseLayout.astro
|   |-- lib/
|   |   |-- sanity.ts
|   |   |-- queries.ts
|   |   |-- promobility.ts
|   |   |-- types.ts
|   |-- pages/
|   |   |-- index.astro
|   |   |-- concesionarios.astro
|   |   |-- descubre-mas.astro
|   |   |-- proteccion-de-datos.astro
|   |   |-- motos/
|   |   |   |-- index.astro
|   |   |   |-- [slug].astro
|   |   |-- noticias/
|   |   |   |-- index.astro
|   |   |   |-- [slug].astro
|   |-- styles/
|       |-- global.css
|       |-- variables.css
|-- studio/
    |-- sanity.config.ts
    |-- sanity.cli.ts
    |-- package.json
    |-- schemas/
```

## 4. Configuracion de Astro

Archivo principal:

```txt
astro.config.mjs
```

Configuracion relevante:

- `site`: actualmente apunta a `https://cyclone-astro.pages.dev`.
- Integraciones: `sitemap()` y `tailwind()`.
- `build.inlineStylesheets = 'always'` para reducir solicitudes CSS criticas.
- `image.domains = ['cdn.sanity.io']` para permitir imagenes desde Sanity CDN.

Cuando se tenga dominio definitivo, actualizar:

```js
site: 'https://dominio-final.cl'
```

Tambien revisar `public/robots.txt` si referencia un sitemap con dominio anterior.

## 5. Sistema visual y estilos

La identidad visual esta centralizada en:

```txt
src/styles/variables.css
tailwind.config.cjs
src/styles/global.css
```

`variables.css` contiene tokens globales:

- Colores de marca: `--color-primary`, `--color-secondary`, `--color-accent`.
- Tipografia: `--font-heading`, `--font-body`.
- Escala responsive con `clamp`: `--text-h1`, `--text-h2`, `--text-body`, etc.
- Espaciados: `--container-max`, `--container-padding`, `--section-spacing`.
- Header: `--header-height`.

Tailwind expone estos tokens como utilidades:

- `font-heading`
- `font-body`
- `text-h1`
- `text-h2`
- `text-h3`
- `text-body`
- `text-body-sm`
- Colores como `primary`, `secondary`, `text`, `muted`, etc.

Las fuentes estan autohospedadas:

```txt
public/fonts/manrope-latin-variable.woff2
public/fonts/roboto-latin-variable.woff2
```

Esto evita depender de Google Fonts y mejora PageSpeed.

## 6. Layout base, SEO y componentes globales

El layout principal esta en:

```txt
src/layouts/BaseLayout.astro
```

Responsabilidades:

- Importa `global.css`.
- Renderiza `Header`, `ConcesionariosModal`, `QuoteModal`, contenido principal y `Footer`.
- Define metadatos SEO primarios.
- Define canonical URL segun `Astro.url.pathname`.
- Define Open Graph y Twitter Card.
- Preload de fuentes y logo.
- Permite preload de imagen LCP del hero mediante `heroImageUrl`.

Componentes globales:

- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`
- `src/components/layout/ConcesionariosModal.astro`
- `src/components/layout/QuoteModal.astro`
- `src/components/ui/Button.astro`

## 7. Rutas del sitio

| Ruta | Archivo | Fuente principal |
|---|---|---|
| `/` | `src/pages/index.astro` | Sanity + Promobility |
| `/motos` | `src/pages/motos/index.astro` | Sanity + Promobility |
| `/motos/[slug]` | `src/pages/motos/[slug].astro` | Sanity + Promobility |
| `/noticias` | `src/pages/noticias/index.astro` | Sanity |
| `/noticias/[slug]` | `src/pages/noticias/[slug].astro` | Sanity |
| `/concesionarios` | `src/pages/concesionarios.astro` | Sanity + Promobility locations |
| `/descubre-mas` | `src/pages/descubre-mas.astro` | Sanity |
| `/proteccion-de-datos` | `src/pages/proteccion-de-datos.astro` | Sanity |

Las rutas antiguas `/blog` y `/noticia` ya no deben usarse. Las noticias viven bajo `/noticias`.

## 8. Conexion con Sanity

Cliente Sanity:

```txt
src/lib/sanity.ts
```

Funcionamiento:

- Usa `@sanity/client`.
- Lee `PUBLIC_SANITY_PROJECT_ID`.
- Lee `PUBLIC_SANITY_DATASET`.
- Usa `apiVersion: '2024-01-01'`.
- Usa CDN en produccion con `useCdn: import.meta.env.PROD`.
- Exporta `urlFor(source)` para construir URLs de imagen optimizadas.

Queries:

```txt
src/lib/queries.ts
```

Contiene GROQ para:

- Noticias.
- Slugs de noticias.
- Motos.
- Slugs de motos.
- Hero del home.
- Slider de motos del home.
- Ofertas del home.
- Info section del home.
- Concesionarios page.
- Descubre mas.
- Proteccion de datos.
- Footer.

Tipos TypeScript:

```txt
src/lib/types.ts
```

Define interfaces como:

- `SanityImage`
- `Post`
- `Moto`
- `HeroSlide`
- `HomeInfoSection`
- `ConcesionariosPage`
- `DescubreMasPage`
- `ProteccionDatosPage`
- `PromobilityMotoModel`
- `HomeSliderMoto`
- `HomeOffer`

## 9. Sanity Studio

El Studio esta en:

```txt
studio/
```

Archivos clave:

- `studio/sanity.config.ts`: configuracion del panel.
- `studio/sanity.cli.ts`: configuracion CLI, project ID, dataset y studio host.
- `studio/schemas/index.ts`: registra todos los schemas disponibles.
- `studio/schemas/*`: definicion de documentos y objetos editables.

Proyecto actual:

```txt
Project ID: 05og18zx
Dataset: production
Studio host: cyclone-motos-cl
Studio URL: https://cyclone-motos-cl.sanity.studio
```

Comandos del Studio:

```bash
cd studio
npm run dev
npm run build
npx sanity deploy
```

Si se despliega con token:

```powershell
$env:SANITY_AUTH_TOKEN='TOKEN_CON_PERMISO_DEPLOY_STUDIO'
npx sanity deploy
```

El token debe tener permiso de deploy de Studio. No guardar tokens reales en GitHub.

## 10. Que es administrable en Sanity

Schemas activos registrados en `studio/schemas/index.ts`:

- `post`: Noticias.
- `blockContent`: contenido enriquecido para noticias y proteccion de datos.
- `moto`: motos y contenido interno de cada moto.
- `heroSlide`: slides del hero del home.
- `homeInfoSection`: seccion informativa del home.
- `oferta`: ofertas del home.
- `concesionariosPage`: pagina de concesionarios.
- `descubreMasPage`: pagina Descubre mas.
- `proteccionDatosPage`: proteccion de datos.
- `footerSettings`: columna Nuestro mundo del footer.

### Home - Hero Slide

Documento `heroSlide`.

Campos:

- Estilo del hero.
- Titulo 1.
- Titulo 2.
- Descripcion.
- Texto del boton.
- URL del boton.
- Estadisticas.
- Imagen desktop.
- Imagen mobile.
- Orden.

Estilos disponibles:

- Titulo izquierda, detalle derecha.
- Titulo derecha, detalle izquierda.
- Titulo centrado, sin detalle.

### Home - Info Section

Documento `homeInfoSection`.

Campos:

- Titulo.
- Descripcion.
- Texto del boton.
- URL del boton.
- Imagen de fondo desktop.
- Imagen mobile.
- Alt de imagen.

### Home - Oferta

Documento `oferta`.

Campos:

- ID de moto en API.
- Orden.

La imagen de la oferta se toma desde el documento de la moto, campo `fotoOferta`.

### Motos

Documento `moto`.

Campos principales:

- Nombre de la moto.
- ID de la moto en API (`apiMotoId`).
- Slug.
- Meta description SEO.
- Foto Header desktop/mobile.
- Foto Oferta desktop/mobile.
- Imagen Slider Home desktop/mobile.
- Mostrar nombre gigante en hero.
- Secuencia de scroll de 13 imagenes desde 0 a 30 grados.
- Iconos del hero.
- Zona informativa: titulo, descripcion e imagen de fondo desktop/mobile.
- Colores de la motocicleta: nombre, codigo HEX, foto desktop/mobile.
- Caracteristicas adicionales: titulo, detalle, foto desktop/mobile.
- Ficha tecnica PDF.
- CTA galeria.
- Titulo de galeria.
- Galeria de fotos desktop/mobile.

Regla importante: las imagenes subidas desde Sanity se restringen a WebP o AVIF en la mayoria de campos. Los iconos del hero permiten tambien SVG.

### Noticias

Documento `post`, titulado como Noticias.

Campos:

- Titulo de noticia.
- Titulo de noticia en home.
- Slug.
- Categoria: TIPS, Eventos o Nuevo.
- Extracto.
- Imagen destacada para Home desktop/mobile.
- Fecha de publicacion.
- Tipo de Hero: imagen destacada o slider de imagenes.
- Slider de imagenes Hero desktop/mobile.
- Contenido de la noticia con Portable Text.
- Galeria de fotos desktop/mobile.

### Concesionarios

Documento `concesionariosPage`.

Campos:

- Titulo.
- Titulo destacado en rojo.
- Descripcion.
- Servicios.
- Icono por servicio desde Sanity.

Los concesionarios reales no se administran en Sanity. Vienen desde la API de Promobility.

### Descubre mas

Documento `descubreMasPage`.

Campos:

- Titulo.
- Titulo destacado en rojo.
- Descripcion superior.
- Imagen de fondo desktop/mobile.
- Descripcion inferior.
- Texto grande inferior.
- Texto del boton.
- URL del boton.

### Proteccion de datos

Documento `proteccionDatosPage`.

Campos:

- Titulo.
- Descripcion SEO.
- Contenido enriquecido.

### Footer

Documento `footerSettings`.

Campos:

- Titulo de Nuestro mundo.
- Links de Nuestro mundo.
- URL por link.
- Opcion de abrir en nueva pestana.

## 11. Imagenes, SEO y rendimiento

Las imagenes administrables tienen campos `alt` obligatorios mediante helpers de schema:

```txt
studio/schemas/imageFields.ts
```

Helpers:

- `createRequiredAltField()`
- `createMobileImageField()`

Buenas practicas actuales:

- Subir imagenes en WebP o AVIF.
- Subir version desktop y mobile cuando el schema lo solicita.
- Rellenar siempre el texto alternativo.
- No subir PNG/JPG en campos restringidos.
- Usar dimensiones recomendadas descritas en cada campo del Studio.
- Las imagenes se sirven desde Sanity CDN y se optimizan con `urlFor()`.

Para imagenes criticas:

- El hero del home usa preload LCP desde `BaseLayout`.
- El header pre-carga el logo.
- Las fuentes se pre-cargan desde `public/fonts`.

## 12. Conexion con Promobility/Track

Logica principal:

```txt
src/lib/promobility.ts
```

Endpoint de modelo:

```txt
https://track.promobility.cl/api/vehiculos/modelo
```

Parametros:

- `id_web`: actualmente `6`.
- `id_vehiculo`: ID definido en Sanity como `apiMotoId`.

Headers:

- `Authorization: Bearer PROMOBILITY_API_TOKEN`
- `Origin: cyclonemotos.cl`

Datos usados desde Promobility:

- Nombre comercial de modelo.
- Precio.
- Precio lista.
- Bono.
- Colores API.
- Cilindrada.
- Peso.
- Altura de asiento.
- Capacidad de estanque.

El cruce de datos se hace por `apiMotoId`. Sanity entrega contenido visual/editorial y Promobility entrega datos comerciales.

## 13. Concesionarios y mapa

Endpoint de sucursales:

```txt
https://track.promobility.cl/api/locations/sucursales?id_web=6
```

Usos:

- Pagina `/concesionarios`.
- Lightbox de mapa desde el header.
- Cotizador, para seleccionar concesionario.

Campos relevantes encontrados:

- Nombre.
- Region.
- Comuna.
- Direccion.
- Telefono.
- Horario.
- Latitud.
- Longitud.
- Tipos de servicio.
- `email`: correo real del concesionario.
- `spider`: codigo interno, no usar como email.

El mapa usa Mapbox y requiere:

```txt
PUBLIC_MAPBOX_TOKEN
```

El mapa se carga en el modal global `ConcesionariosModal`. Todos los pines quedan visibles y el selector de region solo enfoca la zona del mapa.

Script util para probar sucursales:

```bash
node scripts/test-sucursales.mjs
```

Sirve para revisar cantidad de concesionarios, coordenadas y campos disponibles desde API.

## 14. Funciones serverless de Cloudflare

Las funciones viven en:

```txt
functions/api/
```

### `/api/quote-model`

Archivo:

```txt
functions/api/quote-model.ts
```

Funcion:

- Proxy GET hacia Promobility modelo.
- Recibe `id_vehiculo`.
- Usa token server-side.
- Devuelve datos del modelo.

### `/api/quote-submit`

Archivo:

```txt
functions/api/quote-submit.ts
```

Funcion:

- Proxy POST hacia `/cotizacion`.
- Mantiene `PROMOBILITY_API_TOKEN` fuera del navegador.
- Envia payload del formulario de cotizacion.

### `/api/quote-financing`

Archivo:

```txt
functions/api/quote-financing.ts
```

Funcion:

- Proxy POST hacia `/financiamiento`.
- Mantiene token server-side.
- Se usa cuando el usuario solicita financiamiento.

### `/api/autofin-simulation`

Archivo:

```txt
functions/api/autofin-simulation.ts
```

Funcion:

- Proxy POST hacia Autofin.
- Usa `AUTOFIN_SIMULATION_TOKEN`.
- Calcula cuotas/resultado de simulacion.

Todas estas funciones devuelven `Cache-Control: no-store`, ya que trabajan con datos sensibles o dinamicos.

## 15. Cotizador global

Componente:

```txt
src/components/layout/QuoteModal.astro
```

Funcionamiento:

- Se renderiza globalmente desde `BaseLayout`.
- Cualquier boton con atributos `data-quote-*` y/o `data-open-quote` puede abrirlo.
- Es un lightbox fullscreen bajo el header.
- Al abrirse fuerza el header a estado claro.
- Al cerrarse devuelve el header a su estado previo.

Flujo:

1. Seleccion de concesionario.
2. Datos personales.
3. Financiamiento opcional.
4. Envio de cotizacion.
5. Pantalla de exito.

Datos de moto:

- Se obtienen desde los atributos del boton y desde `/api/quote-model`.
- El precio se consulta desde Promobility.
- La imagen/color se cruza con Sanity.

Envio:

- Cotizacion principal: `/api/quote-submit`.
- Financiamiento: `/api/quote-financing`.
- Simulacion Autofin: `/api/autofin-simulation`.

## 16. Funcionamiento del home

Pagina:

```txt
src/pages/index.astro
```

Secciones:

- `Hero`: Sanity.
- `MotoSlider`: Sanity + Promobility.
- `InfoSection`: Sanity.
- `MotosOferta`: Sanity + Promobility.
- `InstagramSection`: imagenes estaticas desde `public`, preparada para futura API de Meta.
- `LatestNews`: Sanity.

El home esta pensado para rendimiento:

- Sliders manuales sin librerias pesadas.
- Imagenes desktop/mobile.
- Fuentes autohospedadas.
- CSS inline en build.
- Preload para imagen hero.

## 17. Funcionamiento de motos

Listado:

```txt
src/pages/motos/index.astro
```

Detalle:

```txt
src/pages/motos/[slug].astro
```

Fuentes:

- Sanity: contenido visual/editorial.
- Promobility: precios, bono, nombre comercial y specs comerciales.

Componentes relevantes:

- `src/components/motos/MotoCard.astro`
- `src/components/motos/MotoCta.astro`
- `src/components/ui/Button.astro`

Detalle de moto:

- Hero con scroll sequence de 13 imagenes.
- Fondo decorativo desde `public/moto/hero.webp`.
- Iconos del hero desde Sanity.
- Colores desde Sanity y/o API.
- Specs desde Promobility.
- Caracteristicas adicionales desde Sanity.
- Zona informativa desde Sanity.
- Ficha tecnica PDF desde Sanity.
- Galeria desde Sanity.
- CTA final con animacion galeria/concesionarios.

## 18. Funcionamiento de noticias

Listado:

```txt
src/pages/noticias/index.astro
```

Detalle:

```txt
src/pages/noticias/[slug].astro
```

Listado:

- Carga noticias desde Sanity.
- Muestra hasta 9 inicialmente.
- Si hay mas, muestra boton para cargar mas.

Detalle:

- Muestra categoria y titulo.
- Hero puede ser imagen destacada o slider, segun campo `heroDisplayMode`.
- Botones para compartir.
- Contenido enriquecido con Portable Text.
- Galeria de fotos.
- Mas noticias aleatorias, maximo 3.

Categorias:

- `tips`
- `eventos`
- `nuevo`

En home, las categorias solo se muestran como filtro si existen al menos 5 noticias con esa categoria.

## 19. Funcionamiento de concesionarios

Pagina:

```txt
src/pages/concesionarios.astro
```

Fuentes:

- Sanity: titulo, descripcion e iconos de servicios.
- Promobility: listado real de concesionarios.

La pagina permite:

- Filtrar por region.
- Filtrar por comuna.
- Mostrar tarjetas de concesionarios.
- Mostrar tipos de servicio.
- Abrir ruta del concesionario.

El correo mostrado debe venir desde `email`, no desde `spider`.

## 20. Variables de entorno

Variables del sitio principal:

```txt
PUBLIC_SANITY_PROJECT_ID
PUBLIC_SANITY_DATASET
PUBLIC_MAPBOX_TOKEN
PROMOBILITY_API_BASE_URL
PROMOBILITY_API_SITE_ID
PROMOBILITY_API_ORIGIN
PROMOBILITY_API_TOKEN
PUBLIC_COTIZACION_API_BASE_URL
COTIZACION_API_BASE_URL
AUTOFIN_SIMULATION_TOKEN
AUTOFIN_SIMULATION_URL
```

Variables del Studio:

```txt
SANITY_STUDIO_PROJECT_ID
SANITY_STUDIO_DATASET
SANITY_STUDIO_HOST
SANITY_AUTH_TOKEN
```

Notas:

- Las variables que comienzan con `PUBLIC_` pueden quedar expuestas al navegador.
- Tokens privados no deben llevar prefijo `PUBLIC_`.
- `PROMOBILITY_API_TOKEN` debe estar en Cloudflare como variable privada.
- `SANITY_AUTH_TOKEN` solo se usa para deploy del Studio si no se inicia sesion con `sanity login`.

## 21. Flujo de trabajo local

Instalar dependencias:

```bash
npm install
cd studio
npm install
```

Levantar sitio:

```bash
npm run dev
```

Levantar Studio:

```bash
cd studio
npm run dev
```

Build del sitio:

```bash
npm run build
```

Preview local de Astro:

```bash
npm run preview
```

Preview tipo Cloudflare Pages:

```bash
npm run preview:pages
```

## 22. Flujo para llegar a produccion

### Cambios de codigo

1. Editar codigo en el repositorio.
2. Probar localmente.
3. Ejecutar build.
4. Subir cambios a GitHub.
5. Cloudflare Pages detecta el push.
6. Cloudflare ejecuta `npm run build`.
7. Cloudflare publica `dist/`.

Comandos:

```bash
npm run build
git status
git add .
git commit -m "descripcion del cambio"
git push
```

### Cambios de contenido en Sanity

1. Entrar al Studio.
2. Editar documento.
3. Publicar.
4. Se ejecuta rebuild de forma automatica en cloudflare a traves de un Deploy Hook.

### Cambios de schemas de Sanity

1. Modificar archivos en `studio/schemas`.
2. Ejecutar build del Studio.
3. Desplegar Studio.
4. Subir cambios de codigo a GitHub.

Comandos:

```bash
cd studio
npm run build
npx sanity deploy
```

## 23. Backups de Sanity

Sanity guarda contenido en su Content Lake. Esto no queda en GitHub ni en Cloudflare.

Para respaldar el contenido:

```bash
cd studio
npx sanity dataset export production ./backups/sanity-production-YYYY-MM-DD.tar.gz
```

El backup guarda:

- Documentos de Sanity.
- Textos.
- Slugs.
- Referencias.
- Portable Text.
- Imagenes y assets subidos a Sanity.
- Archivos subidos a Sanity, por ejemplo PDFs.
- Metadatos de imagenes y archivos.

El backup no guarda:

- Codigo Astro.
- Componentes.
- Estilos.
- Variables de entorno.
- Configuracion de Cloudflare.
- Datos externos de Promobility.
- Datos externos de Autofin.
- Imagenes locales en `public/`.

Por eso se recomienda:

- GitHub para codigo.
- Export de Sanity para contenido CMS.
- Backup aparte para variables sensibles.
- Backup de assets locales si no estan versionados en Git.

## 24. Restaurar backup de Sanity

Restaurar primero en un dataset de prueba:

```bash
cd studio
npx sanity dataset create restore-test
npx sanity dataset import ./backups/sanity-production-YYYY-MM-DD.tar.gz restore-test
```

Si se valida correctamente, restaurar en production:

```bash
npx sanity dataset import ./backups/sanity-production-YYYY-MM-DD.tar.gz production --replace
```

Advertencias:

- `--replace` reemplaza el contenido del dataset destino.
- Antes de restaurar production, generar un backup fresco del estado actual.
- Despues de restaurar contenido, hacer rebuild del sitio en Cloudflare Pages si el contenido se renderiza estaticamente.

## 25. Sanity: como funciona en este proyecto

Sanity tiene tres capas:

1. Content Lake: base de datos administrada por Sanity donde viven documentos y assets.
2. Studio: panel visual para crear/editar/publicar contenido.
3. Schemas: codigo del proyecto que define que campos existen y como se ven en el Studio.

En Cyclone:

- El Content Lake vive en el proyecto `05og18zx`, dataset `production`.
- El Studio esta en `studio/` y se despliega en `cyclone-motos-cl.sanity.studio`.
- Los schemas viven en GitHub, dentro de `studio/schemas`.
- El sitio Astro lee contenido desde Sanity durante build.
- Las imagenes se sirven desde `cdn.sanity.io`.

Si se cambia contenido:

- Cambia el Content Lake.
- El schema no cambia.
- Puede requerir rebuild del sitio.

Si se cambia schema:

- Cambia el codigo.
- Hay que desplegar Studio.
- Hay que subir el cambio a GitHub.

## 26. Cloudflare Pages

Cloudflare Pages publica el sitio generado por Astro.

Configuracion recomendada:

- Framework preset: Astro.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Production branch: rama principal del repositorio.
- Variables de entorno: configurar las variables del sitio y funciones.

Funciones serverless:

- Cloudflare detecta automaticamente `functions/api/*`.
- Estas rutas quedan disponibles como `/api/...`.
- Son necesarias para no exponer tokens privados al frontend.

## 27. Seguridad y tokens

Buenas practicas:

- No commitear `.env`.
- No poner tokens reales en Markdown versionado.
- Usar variables privadas en Cloudflare para tokens.
- Usar prefijo `PUBLIC_` solo para variables que pueden exponerse al navegador.
- Rotar tokens si se filtran.
- Para Sanity Studio deploy usar token con permisos justos, por ejemplo deploy/developer segun necesidad.

## 28. Rendimiento

Decisiones aplicadas:

- Astro genera HTML estatico.
- Sliders manuales sin librerias externas.
- Fuentes autohospedadas.
- Imagenes WebP/AVIF.
- Imagenes mobile/desktop por schema.
- Preload de fuentes y logo.
- Preload de hero LCP cuando se conoce.
- Mapbox se carga en modal, no como parte critica del primer render.
- Funciones de API devuelven `no-store`.

Puntos a vigilar:

- Imagenes demasiado grandes en Sanity pueden afectar LCP.
- Cada cambio de contenido estatico requiere rebuild si no hay webhook.
- Mapbox depende de WebGL; si el dispositivo/navegador falla en WebGL, el mapa no inicializa.
- Los sliders y animaciones deben mantener accesibilidad y no crear scroll horizontal.

## 29. Accesibilidad

Practicas aplicadas:

- Alt obligatorio en imagenes Sanity.
- Uso de botones reales para acciones.
- Modales con control de apertura/cierre.
- Correccion de `aria-hidden` en menu mobile para evitar descendientes enfocables ocultos.
- Dots de sliders con area tactil suficiente.

Puntos a revisar en futuras mejoras:

- Focus trap completo en modales.
- Navegacion por teclado en sliders.
- Mensajes de error visibles y anunciables en cotizador.
- Estados `aria-current` en rutas activas.

## 30. Mantenimiento recomendado

Checklist semanal:

- Revisar deploys fallidos en Cloudflare Pages.
- Revisar si Sanity Studio sigue accesible.
- Probar cotizador en produccion.
- Probar mapa de concesionarios.
- Verificar que nuevas imagenes tengan alt y version mobile.
- Ejecutar backup de Sanity.

Checklist al subir contenido:

- Completar alt de imagenes.
- Usar WebP/AVIF.
- Publicar documento.
- Rebuild del sitio si no existe webhook.
- Revisar visualmente mobile y desktop.

Checklist al modificar codigo:

- Ejecutar `npm run build`.
- Revisar rutas principales.
- Revisar que no exista scroll horizontal.
- Revisar cotizador si se tocaron botones o cards.
- Subir a GitHub.
- Verificar deploy en Cloudflare.

## 31. Comandos de referencia

Sitio:

```bash
npm run dev
npm run build
npm run preview
npm run preview:pages
```

Studio:

```bash
cd studio
npm run dev
npm run build
npx sanity deploy
```

Backups:

```bash
cd studio
npx sanity dataset export production ./backups/sanity-production-YYYY-MM-DD.tar.gz
npx sanity dataset import ./backups/sanity-production-YYYY-MM-DD.tar.gz restore-test
```

Sucursales:

```bash
node scripts/test-sucursales.mjs
```

## 32. Responsabilidades por plataforma

GitHub guarda:

- Codigo del sitio.
- Componentes Astro.
- Estilos.
- Schemas de Sanity.
- Configuracion.
- Assets estaticos en `public/`.
- Documentacion tecnica.

Sanity guarda:

- Contenido administrable.
- Motos y sus imagenes CMS.
- Noticias.
- Textos de paginas.
- Imagenes subidas desde el Studio.
- PDFs subidos desde el Studio.
- Slugs y referencias.

Promobility/Track guarda:

- Modelos comerciales.
- Precios.
- Bonos.
- Concesionarios.
- Coordenadas.
- Cotizaciones/financiamiento segun endpoint.

Cloudflare Pages guarda/publica:

- Build estatico en `dist`.
- Variables de entorno configuradas.
- Funciones serverless.
- Deploys del sitio.

Mapbox entrega:

- Mapa interactivo.
- Tiles y render WebGL.

Autofin entrega:

- Simulacion de cuotas cuando se usa financiamiento.

## 33. Notas tecnicas importantes

- El sitio es principalmente estatico, por lo que contenido de Sanity puede necesitar rebuild.
- Las funciones `/api/*` solo corren en Cloudflare Pages o preview compatible con Wrangler.
- En desarrollo local con `astro dev`, si una funcion no existe puede aparecer 404. Para probar funciones Cloudflare usar `npm run preview:pages`.
- El campo `spider` de concesionarios no es correo. Usar `email`.
- La carpeta `public/home/instagram` contiene imagenes temporales hasta conectar Meta API.
- El header mobile usa imagen mobile de `fotoHeader` cuando existe.
- El cotizador usa imagenes de color desde Sanity y precios desde Promobility.
- Los schemas obligan alt y mobile image en varios campos para sostener SEO y rendimiento.

