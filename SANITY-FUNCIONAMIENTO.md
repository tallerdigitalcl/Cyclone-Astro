# Funcionamiento de Sanity en Cyclone Motos

Este documento resume como se esta utilizando Sanity en el proyecto Cyclone Motos, que contenido administra, como se conecta con el sitio Astro y que considerar para backups, deploys y mantenimiento.

## Que es Sanity en este proyecto

Sanity funciona como el CMS del sitio. Es el lugar donde se administra el contenido editable sin tocar codigo.

En este proyecto Sanity se usa para administrar contenido editorial y visual, por ejemplo:

- Slides del hero del home.
- Imagenes desktop y mobile.
- Textos alternativos de imagenes para SEO.
- Motos administrables y su ID de conexion con la API de Promobility.
- Imagenes del slider de motos del home.
- Seccion informativa del home.
- Ofertas del home.
- Noticias, categorias, extractos, imagenes y contenido interno.
- Galerias, fichas tecnicas y contenido futuro de motos.

Sanity no reemplaza la API de Promobility. Promobility sigue siendo la fuente de datos comerciales como precios, bonos, nombres de modelos y concesionarios.

## Donde vive el contenido

El contenido administrado desde Sanity vive en Sanity Content Lake, dentro del proyecto:

```txt
Project ID: #####
Dataset: #####
```

El contenido no queda guardado en GitHub ni en Cloudflare Pages. GitHub guarda el codigo, los schemas y la configuracion, pero los documentos editados desde el panel viven en Sanity.

Las imagenes subidas desde Sanity se sirven desde Sanity CDN, normalmente con URLs similares a:

```txt
https://cdn.sanity.io/images/05og18zx/production/...
```

Las imagenes estaticas que estan dentro de `public/` no vienen desde Sanity. Por ejemplo, actualmente la seccion temporal de Instagram utiliza imagenes locales desde `public`.

## Sanity Studio

El Studio es el panel visual donde se edita el contenido. En este proyecto esta dentro de:

```txt
studio/
```

Los schemas del Studio estan en:

```txt
studio/schemas/
```

Archivos principales:

- `studio/schemas/index.ts`: registra todos los schemas disponibles.
- `studio/schemas/heroSlide.ts`: slides del hero del home.
- `studio/schemas/moto.ts`: contenido administrable de motos.
- `studio/schemas/homeInfoSection.ts`: seccion informativa del home.
- `studio/schemas/oferta.ts`: ofertas del home.
- `studio/schemas/post.ts`: noticias.
- `studio/schemas/imageFields.ts`: helpers reutilizables para imagenes con alt/mobile.

Cuando se cambia un schema, hay que compilar y desplegar el Studio para verlo en el panel online.

```bash
cd studio
npm run build
npx sanity deploy
```

## Como Astro consume Sanity

El sitio Astro consulta Sanity desde:

```txt
src/lib/sanity.ts
src/lib/queries.ts
```

`src/lib/sanity.ts` configura el cliente de Sanity y el helper `urlFor(...)` para generar URLs optimizadas de imagenes.

`src/lib/queries.ts` contiene las consultas GROQ que traen el contenido. Por ejemplo:

- `heroSlidesQuery`
- `motosHomeSliderQuery`
- `homeInfoSectionQuery`
- `ofertasHomeQuery`
- `postsQuery`

La pagina principal consume esas queries en:

```txt
src/pages/index.astro
```

Actualmente el home hace consultas a Sanity y luego renderiza estas secciones:

- `Hero`
- `MotoSlider`
- `InfoSection`
- `MotosOferta`
- `InstagramSection`
- `LatestNews`

## Relacion entre Sanity y Promobility

Sanity contiene la parte editorial y visual. Promobility contiene datos comerciales.

Ejemplo en motos:

- Sanity guarda el ID de la moto, imagenes, descripciones, galeria y contenido visual.
- Promobility entrega nombre comercial, precio lista, bono y precio final.

El cruce se hace usando el ID de la moto definido en Sanity.

La logica de conexion con Promobility esta en:

```txt
src/lib/promobility.ts
```

Variables de entorno usadas para Promobility:

```txt
PROMOBILITY_API_BASE_URL
PROMOBILITY_API_SITE_ID
PROMOBILITY_API_ORIGIN
PROMOBILITY_API_TOKEN
```

## Variables de entorno de Sanity

El sitio necesita estas variables para leer contenido desde Sanity:

```txt
PUBLIC_SANITY_PROJECT_ID=05og18zx
PUBLIC_SANITY_DATASET=production
```

El Studio utiliza sus propias variables:

```txt
SANITY_STUDIO_PROJECT_ID=05og18zx
SANITY_STUDIO_DATASET=production
```

Estas variables deben existir localmente y tambien en Cloudflare Pages para que el build pueda consultar Sanity.

## Imagenes y SEO

Las imagenes administradas desde Sanity deben tener texto alternativo `alt`.

En varias secciones se usa version desktop y mobile para mejorar rendimiento:

- Hero.
- Motos.
- Ofertas.
- Info section.
- Noticias.

En el frontend se usa `urlFor(...)` para generar imagenes en tamanos optimizados. En general se evita forzar `height()` cuando la imagen ya viene en la proporcion correcta, para no provocar recortes o sensacion de zoom.

Ejemplo conceptual:

```ts
urlFor(image).width(1600).quality(85).auto('format').url()
```

## Hero del home

El hero esta administrado por documentos `heroSlide`.

Cada slide puede tener:

- Titulo 1.
- Titulo 2.
- Descripcion.
- Boton.
- Imagen desktop.
- Imagen mobile.
- Estadisticas.
- Orden.
- Estilo de hero.

El campo `estiloHero` permite elegir entre:

- `titleLeftDetailRight`: titulo izquierda, detalle derecha.
- `titleRightDetailLeft`: titulo derecha, detalle izquierda.
- `titleCenterNoDetail`: titulo centrado, sin detalle.

Si existe mas de un slide, el hero funciona como slider.

## Noticias

Las noticias se administran desde el schema `post`, mostrado en Sanity como `Noticias`.

Campos principales:

- Titulo de noticia.
- Titulo de noticia para home.
- Extracto.
- Categoria.
- Imagen destacada para home.
- Slug.
- Imagenes hero opcionales.
- Contenido de noticia opcional.
- Galeria opcional.

Las rutas del sitio son:

```txt
/noticia
/noticia/[slug]
```

## Backups de Sanity

El backup de Sanity se realiza exportando el dataset.

```bash
cd studio
npx sanity dataset export production backups/production-YYYY-MM-DD.tar.gz
```

El export estandar guarda:

- Documentos del CMS.
- Textos.
- Slugs.
- Referencias.
- Imagenes/assets subidos a Sanity.
- Archivos subidos a Sanity, como PDFs si existen.

No guarda:

- Codigo del sitio.
- Componentes Astro.
- Estilos.
- Configuracion de Cloudflare.
- Datos de Promobility.

El codigo se respalda con GitHub. El contenido se respalda con export de Sanity.

## Restaurar un backup

Lo mas seguro es restaurar primero en un dataset de prueba:

```bash
cd studio
npx sanity dataset create restore-test
npx sanity dataset import backups/production-YYYY-MM-DD.tar.gz restore-test
```

Si se necesita restaurar en produccion, hacerlo con cuidado:

```bash
npx sanity dataset import backups/production-YYYY-MM-DD.tar.gz production --replace
```

Despues de restaurar contenido, hay que hacer un nuevo build/deploy del sitio en Cloudflare Pages para que el HTML estatico tome el contenido restaurado.

## Deploy del sitio

El sitio se despliega en Cloudflare Pages desde GitHub.

Cuando hay cambios de codigo:

```bash
git push
```

Cloudflare Pages ejecuta el build y genera el sitio estatico.

Cuando solo se edita contenido en Sanity, el sitio publicado no siempre se actualiza automaticamente si esta generado como estatico. En ese caso puede requerirse un rebuild/deploy en Cloudflare Pages para publicar los cambios.

## Deploy del Studio

Cuando se cambian schemas o configuracion del Studio:

```bash
cd studio
npm run build
npx sanity deploy
```

Esto actualiza el panel de administracion online, no el sitio publico.

## Resumen de responsabilidades

GitHub guarda:

- Codigo Astro.
- Componentes.
- Estilos.
- Schemas de Sanity.
- Configuracion.
- Scripts.
- Assets estaticos de `public/`.

Sanity guarda:

- Contenido editable.
- Documentos del CMS.
- Imagenes y assets subidos desde el Studio.
- Referencias entre documentos.
- Slugs y textos SEO.

Promobility guarda:

- Datos comerciales de motos.
- Precios.
- Bonos.
- Datos de concesionarios.
- Coordenadas si estan disponibles.

Cloudflare Pages publica:

- HTML, CSS y JS generados por Astro.
- Assets estaticos del sitio.
- Deploys del frontend.

