import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homeInfoSection',
  title: 'Home - Info Section',
  type: 'document',
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
      name: 'botonTexto',
      title: 'Texto del boton',
      type: 'string',
    }),
    defineField({
      name: 'botonUrl',
      title: 'URL del boton',
      type: 'string',
      hidden: ({ document }) => !document?.botonTexto,
    }),
    defineField({
      name: 'imagenFondo',
      title: 'Imagen de fondo',
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
          description: 'Obligatorio para SEO y accesibilidad.',
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
      subtitle: 'descripcion',
      media: 'imagenFondo',
    },
  },
});
