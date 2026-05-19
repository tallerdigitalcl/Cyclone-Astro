import { defineField, defineType } from 'sanity';
import { createMobileImageField, createRequiredAltField } from './imageFields';

export default defineType({
  name: 'descubreMasPage',
  title: 'Descubre mas',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Titulo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tituloDestacado',
      title: 'Titulo destacado en rojo',
      type: 'string',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripcion superior',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagenFondo',
      title: 'Imagen de fondo Desktop',
      description: 'Imagen principal de la seccion superior. Recomendado: horizontal, WebP o AVIF.',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        createRequiredAltField(),
        createMobileImageField({
          description: 'Version optimizada para mobile. Recomendado: vertical, WebP o AVIF.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcionInferior',
      title: 'Descripcion inferior',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'textoGrandeInferior',
      title: 'Texto grande inferior',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'botonTexto',
      title: 'Texto del boton',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'botonUrl',
      title: 'URL del boton',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'tituloDestacado',
      media: 'imagenFondo',
    },
  },
});
