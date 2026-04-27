import { defineField, defineType } from 'sanity';
import { createMobileImageField, createRequiredAltField } from './imageFields';

export default defineType({
  name: 'oferta',
  title: 'Home - Oferta',
  type: 'document',
  fields: [
    defineField({
      name: 'apiMotoId',
      title: 'ID de la moto (API)',
      type: 'string',
      description: 'ID exacto de Track/Promobility para cruzar nombre, precio lista y bono.',
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
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      description: 'Menor numero = aparece primero.',
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
      title: 'apiMotoId',
      subtitle: 'orden',
      media: 'imagenFondo',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ? `Oferta ${title}` : 'Oferta sin ID',
        subtitle: typeof subtitle === 'number' ? `Orden: ${subtitle}` : 'Sin orden',
        media,
      };
    },
  },
});
