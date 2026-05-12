import { defineField, defineType } from 'sanity';
import { createMobileImageField, createRequiredAltField } from './imageFields';

export default defineType({
  name: 'moto',
  title: 'Moto',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'scrollSequence', title: 'Scroll sequence' },
    { name: 'info', title: 'Zona informativa' },
    { name: 'colors', title: 'Colores' },
    { name: 'features', title: 'Caracteristicas' },
    { name: 'gallery', title: 'Galeria' },
    { name: 'cta', title: 'CTA final' },
    { name: 'files', title: 'Archivos' },
  ],
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre de la moto',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'apiMotoId',
      title: 'ID de la moto (API)',
      type: 'string',
      description: 'ID exacto con el que esta moto se cruza contra la API externa.',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Campo tecnico para la URL de la moto dentro del sitio.',
      options: { source: 'nombre', maxLength: 96 },
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Meta description (SEO)',
      type: 'text',
      rows: 4,
      description: 'Texto que aparece en Google y al compartir el link en redes sociales. No se muestra en la página.',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fotoHeader',
      title: 'Foto Header',
      type: 'image',
      description: 'Imagen principal que aparece en el header de la moto.',
      group: 'general',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        createRequiredAltField({
          title: 'Texto alternativo (SEO)',
        }),
      ],
    }),
    defineField({
      name: 'mostrarNombreGigante',
      title: 'Mostrar nombre gigante en el hero?',
      type: 'boolean',
      description: 'Activa el texto decorativo grande con el nombre de la moto en el fondo del hero.',
      group: 'scrollSequence',
      initialValue: true,
    }),
    defineField({
      name: 'scrollSequenceFrames',
      title: 'Secuencia de scroll 0 a 30 grados',
      type: 'array',
      description: 'Sube exactamente 13 imagenes: 0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5 y 30 grados.',
      group: 'scrollSequence',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/webp,image/avif',
          },
          fields: [
            defineField({
              name: 'grado',
              title: 'Grado',
              type: 'number',
              description: 'Ej: 0, 2.5, 5, 7.5 ... hasta 30.',
              validation: (Rule) => Rule.required().min(0).max(30),
            }),
            createRequiredAltField({
              title: 'Texto alternativo Desktop',
            }),
            createMobileImageField(),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.length(13).error('Debes subir exactamente 13 imagenes para la secuencia de 0 a 30 grados.'),
    }),
    defineField({
      name: 'heroImagenes',
      title: 'Hero iconos',
      type: 'array',
      description: 'Iconos que aparecen en la zona inferior derecha del hero de la moto. Ej: Euro 3, ABS.',
      group: 'hero',
      of: [
        {
          type: 'image',
          options: {
            hotspot: false,
            accept: 'image/webp,image/avif,image/svg+xml',
          },
          fields: [
            createRequiredAltField({
              title: 'Texto alternativo del icono',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'imagenSliderHome',
      title: 'Imagen slider home Desktop',
      type: 'image',
      group: 'hero',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        createRequiredAltField({
          title: 'Texto alternativo Desktop',
        }),
        createMobileImageField(),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'zonaInformativa',
      title: 'Zona informativa',
      type: 'object',
      group: 'info',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Titulo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripcion',
          type: 'text',
          rows: 4,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'imagenFondo',
          title: 'Imagen de fondo Desktop',
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/webp,image/avif',
          },
          fields: [
            createRequiredAltField({
              title: 'Texto alternativo Desktop',
            }),
            createMobileImageField(),
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'colores',
      title: 'Colores de la motocicleta',
      type: 'array',
      group: 'colors',
      of: [
        {
          type: 'object',
          name: 'colorMoto',
          title: 'Color',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Nombre del color',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'codigoHex',
              title: 'Codigo HEX',
              type: 'string',
              description: 'Opcional. Ejemplo: #D6000F',
            }),
            defineField({
              name: 'imagen',
              title: 'Foto de la motocicleta para este color (Desktop)',
              type: 'image',
              options: {
                hotspot: true,
                accept: 'image/webp,image/avif',
              },
              fields: [
                createRequiredAltField({
                  title: 'Texto alternativo Desktop',
                }),
                createMobileImageField(),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'nombre',
              subtitle: 'codigoHex',
              media: 'imagen',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'caracteristicasAdicionales',
      title: 'Caracteristicas adicionales',
      type: 'array',
      group: 'features',
      of: [
        {
          type: 'object',
          name: 'caracteristicaMoto',
          title: 'Caracteristica',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Titulo',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'detalle',
              title: 'Detalle',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imagen',
              title: 'Foto de la caracteristica (Desktop)',
              type: 'image',
              options: {
                hotspot: true,
                accept: 'image/webp,image/avif',
              },
              fields: [
                createRequiredAltField({
                  title: 'Texto alternativo Desktop',
                }),
                createMobileImageField(),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'titulo',
              subtitle: 'detalle',
              media: 'imagen',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'fichaTecnica',
      title: 'Ficha tecnica (PDF)',
      type: 'file',
      group: 'files',
      options: {
        accept: 'application/pdf',
      },
    }),
    defineField({
      name: 'ctaFinal',
      title: 'CTA final',
      type: 'object',
      group: 'cta',
      description: 'Seccion al final de la pagina con titulo e imagen de fondo.',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Titulo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'imagenFondo',
          title: 'Imagen de fondo Desktop',
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/webp,image/avif',
          },
          fields: [
            createRequiredAltField({
              title: 'Texto alternativo Desktop',
            }),
            createMobileImageField(),
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'tituloGaleria',
      title: 'Titulo galeria',
      type: 'string',
      group: 'gallery',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galeriaFotos',
      title: 'Galeria de fotos',
      type: 'array',
      group: 'gallery',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/webp,image/avif',
          },
          fields: [
            createRequiredAltField({
              title: 'Texto alternativo Desktop',
            }),
            createMobileImageField(),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'apiMotoId',
      media: 'heroImagenes.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `ID API: ${subtitle}` : 'Sin ID API',
        media,
      };
    },
  },
});
