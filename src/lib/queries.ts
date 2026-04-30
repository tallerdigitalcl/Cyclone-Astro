// Listado completo de entradas ordenadas por fecha
export const postsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    homeTitle,
    "slug": slug.current,
    category,
    excerpt,
    publishedAt,
    homeImage {
      ...,
      alt,
      mobileImage {
        ...,
        alt
      }
    }
  }
`;

// Entrada individual por slug
export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    homeTitle,
    "slug": slug.current,
    category,
    excerpt,
    publishedAt,
    homeImage {
      ...,
      alt,
      mobileImage {
        ...,
        alt
      }
    },
    heroImages[]{
      ...,
      alt,
      mobileImage {
        ...,
        alt
      }
    },
    galleryPhotos[]{
      ...,
      alt,
      mobileImage {
        ...,
        alt
      }
    },
    body,
    "author": author->{ name, image }
  }
`;

// Todos los slugs publicados (para generación estática)
export const allSlugsQuery = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ---- Motos ----

// Todas las motos
export const motosQuery = `
  *[_type == "moto"] | order(_createdAt desc) {
    _id,
    nombre,
    "slug": slug.current,
    marca,
    modelo,
    anio,
    precio,
    precioAnterior,
    enOferta,
    destacada,
    imagenPrincipal,
    descripcion
  }
`;

// Ofertas del home
export const ofertasHomeQuery = `
  *[_type == "oferta"] | order(orden asc, _createdAt desc) [0..7] {
    _id,
    apiMotoId,
    orden,
    imagenFondo {
      ...,
      alt,
      mobileImage {
        ...,
        alt
      }
    },
    "slug": *[_type == "moto" && apiMotoId == ^.apiMotoId][0].slug.current
  }
`;

// Motos destacadas para el slider del home
export const motosHomeSliderQuery = `
  *[_type == "moto" && defined(apiMotoId) && defined(imagenSliderHome.asset)] | order(_createdAt asc) [0..11] {
    _id,
    nombre,
    "slug": slug.current,
    apiMotoId,
    imagenSliderHome { ..., alt }
  }
`;

// Moto individual por slug
export const motoBySlugQuery = `
  *[_type == "moto" && slug.current == $slug][0] {
    _id,
    nombre,
    "slug": slug.current,
    marca,
    modelo,
    anio,
    precio,
    precioAnterior,
    enOferta,
    imagenPrincipal,
    apiMotoId,
    scrollSequenceFrames[] | order(grado asc) {
      ...,
      grado,
      alt,
      mobileImage {
        ...,
        alt
      }
    },
    heroImagenes[]{
      ...,
      alt,
      asset-> {
        _id,
        url
      }
    },
    zonaInformativa {
      titulo,
      descripcion,
      imagenFondo {
        ...,
        alt,
        mobileImage {
          ...,
          alt
        }
      }
    },
    caracteristicasAdicionales[]{
      titulo,
      detalle,
      imagen {
        ...,
        alt,
        mobileImage {
          ...,
          alt
        }
      }
    },
    fichaTecnica {
      asset-> {
        url,
        originalFilename
      }
    },
    galeria,
    galeriaFotos[]{
      ...,
      alt,
      mobileImage {
        ...,
        alt
      }
    },
    descripcion,
    body,
    specs
  }
`;

// Todos los slugs de motos (para generación estática)
export const allMotoSlugsQuery = `
  *[_type == "moto" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ---- Hero Slides ----

export const heroSlidesQuery = `
  *[_type == "heroSlide"] | order(orden asc) {
    _id,
    estiloHero,
    titulo1,
    titulo2,
    descripcion,
    botonTexto,
    botonUrl,
    stats[] { etiqueta, valor, unidad },
    imagen { ..., alt },
    imagenMobile { ..., alt }
  }
`;

export const homeInfoSectionQuery = `
  *[_type == "homeInfoSection"] | order(_updatedAt desc)[0] {
    _id,
    titulo,
    descripcion,
    botonTexto,
    botonUrl,
    imagenFondo {
      ...,
      alt,
      mobileImage {
        ...,
        alt
      }
    }
  }
`;
