import { defineArrayMember, defineField, defineType } from 'sanity';
import { createRequiredAltField } from './imageFields';

export default defineType({
  name: 'concesionariosPage',
  title: 'Concesionarios',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Titulo',
      type: 'string',
      description: 'Ej: Encuentra tu',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tituloDestacado',
      title: 'Titulo destacado en rojo',
      type: 'string',
      description: 'Ej: Proxima aventura',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripcion',
      type: 'text',
      rows: 3,
      description: 'Puedes escribir una o varias lineas. Se respetaran los saltos de linea.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'servicios',
      title: 'Servicios',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Titulo',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icono',
              title: 'Icono',
              type: 'image',
              description: 'Sube el icono del servicio en formato WebP o AVIF.',
              options: {
                hotspot: false,
                accept: 'image/webp,image/avif',
              },
              fields: [createRequiredAltField()],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'titulo',
              subtitle: 'icono',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'tituloDestacado',
    },
    prepare({ title, subtitle }) {
      return {
        title: 'Concesionarios',
        subtitle: [title, subtitle].filter(Boolean).join(' '),
      };
    },
  },
});
