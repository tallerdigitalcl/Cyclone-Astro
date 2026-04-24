import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'moto',
  title: 'Moto',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'colors', title: 'Colores' },
    { name: 'features', title: 'Caracteristicas' },
    { name: 'gallery', title: 'Galeria' },
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
      name: 'tituloDescriptivo',
      title: 'Titulo descriptivo',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripcion',
      type: 'text',
      rows: 4,
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImagenes',
      title: 'Hero imagenes',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/webp,image/avif',
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('El texto alternativo es obligatorio para SEO y accesibilidad.'),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'imagenSliderHome',
      title: 'Imagen slider home',
      type: 'image',
      group: 'hero',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) =>
            Rule.required().error('El texto alternativo es obligatorio para SEO y accesibilidad.'),
        }),
      ],
      validation: (Rule) => Rule.required(),
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
              title: 'Foto de la motocicleta para este color',
              type: 'image',
              options: {
                hotspot: true,
                accept: 'image/webp,image/avif',
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Texto alternativo',
                  type: 'string',
                  validation: (Rule) =>
                    Rule.required().error('El texto alternativo es obligatorio para SEO y accesibilidad.'),
                }),
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
              title: 'Foto de la caracteristica',
              type: 'image',
              options: {
                hotspot: true,
                accept: 'image/webp,image/avif',
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Texto alternativo',
                  type: 'string',
                  validation: (Rule) =>
                    Rule.required().error('El texto alternativo es obligatorio para SEO y accesibilidad.'),
                }),
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
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('El texto alternativo es obligatorio para SEO y accesibilidad.'),
            }),
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
