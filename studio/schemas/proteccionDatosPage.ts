import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'proteccionDatosPage',
  title: 'Proteccion de Datos',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Titulo',
      type: 'string',
      initialValue: 'Proteccion de Datos',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descripcionSeo',
      title: 'Descripcion SEO',
      type: 'text',
      rows: 3,
      description: 'Resumen corto para buscadores. Si se deja vacio se usara el inicio del contenido.',
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
    },
  },
});
