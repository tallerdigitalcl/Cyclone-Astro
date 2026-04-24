import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo1',
      title: 'Título 1 (blanco)',
      type: 'string',
      description: 'Primera línea del título principal, se muestra en blanco.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titulo2',
      title: 'Título 2 (rojo)',
      type: 'string',
      description: 'Segunda línea del título, se muestra en rojo.',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'string',
      description: 'Texto pequeño debajo del título. Ej: #Live to Roll',
    }),
    defineField({
      name: 'botonTexto',
      title: 'Texto del botón',
      type: 'string',
      description: 'Ej: Cotiza aquí',
    }),
    defineField({
      name: 'botonUrl',
      title: 'URL del botón',
      type: 'string',
      description: 'Ruta o URL a la que apunta el botón. Ej: /motos/ra2',
    }),
    defineField({
      name: 'stats',
      title: 'Estadísticas',
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
              description: 'Número grande. Ej: 250',
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
      title: 'Imagen de fondo',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (SEO)',
          type: 'string',
          description: 'Describe la imagen para motores de búsqueda y accesibilidad.',
          validation: (Rule) => Rule.required().error('El texto alternativo es obligatorio para SEO.'),
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
          description: 'Describe la imagen mobile para motores de búsqueda y accesibilidad.',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              if (context?.parent?.asset && !value) {
                return 'Si subes imagen mobile, el ALT es obligatorio.';
              }
              return true;
            }),
        }),
      ],
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      description: 'Número que define el orden del slide. Menor número = primero.',
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
