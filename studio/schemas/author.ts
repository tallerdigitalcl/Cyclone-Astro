import { defineField, defineType } from 'sanity';
import { createMobileImageField, createRequiredAltField } from './imageFields';

export default defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      title: 'Foto de perfil Desktop',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        createRequiredAltField({
          description: 'Importante para SEO y accesibilidad.',
        }),
        createMobileImageField(),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biografia',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
});
