import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'oferta',
  title: 'Home - Oferta',
  type: 'document',
  fields: [
    defineField({
      name: 'apiMotoId',
      title: 'ID de la moto (API)',
      type: 'string',
      description: 'ID exacto de Track/Promobility para cruzar nombre, precio lista y bono. La foto vendrá desde el documento de la moto.',
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
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? `Oferta ${title}` : 'Oferta sin ID',
        subtitle: typeof subtitle === 'number' ? `Orden: ${subtitle}` : 'Sin orden',
      };
    },
  },
});
