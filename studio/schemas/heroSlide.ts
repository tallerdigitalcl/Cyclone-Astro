import { defineField, defineType } from 'sanity';
import { createRequiredAltField } from './imageFields';

export default defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo1',
      title: 'Titulo 1 (blanco)',
      type: 'string',
      description: 'Primera linea del titulo principal, se muestra en blanco.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titulo2',
      title: 'Titulo 2 (rojo)',
      type: 'string',
      description: 'Segunda linea del titulo, se muestra en rojo.',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripcion',
      type: 'string',
      description: 'Texto pequeno debajo del titulo. Ej: #Live to Roll',
    }),
    defineField({
      name: 'botonTexto',
      title: 'Texto del boton',
      type: 'string',
      description: 'Ej: Cotiza aqui',
    }),
    defineField({
      name: 'botonUrl',
      title: 'URL del boton',
      type: 'string',
      description: 'Ruta o URL a la que apunta el boton. Ej: /motos/ra2',
    }),
    defineField({
      name: 'stats',
      title: 'Estadisticas',
      type: 'array',
      description: 'Hasta 3 especificaciones que aparecen en el panel lateral (ej: Cilindrada, Potencia, Peso).',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'etiqueta',
              title: 'Etiqueta',
              type: 'string',
              description: 'Ej: CILINDRADA',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'valor',
              title: 'Valor',
              type: 'string',
              description: 'Numero grande. Ej: 250',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'unidad',
              title: 'Unidad',
              type: 'string',
              description: 'Unidad de medida. Ej: cc',
            }),
          ],
          preview: {
            select: { title: 'etiqueta', subtitle: 'valor' },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen de fondo Desktop',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        createRequiredAltField({
          title: 'Texto alternativo Desktop (SEO)',
          description: 'Describe la imagen desktop para motores de busqueda y accesibilidad.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagenMobile',
      title: 'Imagen para Mobile',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo Mobile (SEO)',
          type: 'string',
          description: 'Describe la imagen mobile para motores de busqueda y accesibilidad.',
          validation: (Rule) => Rule.required().error('El texto alternativo mobile es obligatorio para SEO.'),
        }),
      ],
      validation: (Rule) => Rule.required().error('La imagen mobile es obligatoria.'),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      description: 'Numero que define el orden del slide. Menor numero = primero.',
      initialValue: 1,
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: 'Orden ascendente',
      name: 'ordenAsc',
      by: [{ field: 'orden', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'titulo1',
      subtitle: 'titulo2',
      media: 'imagen',
    },
  },
});
