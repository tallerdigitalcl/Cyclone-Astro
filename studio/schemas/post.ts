import { defineField, defineType } from 'sanity';
import { createMobileImageField, createRequiredAltField } from './imageFields';

export default defineType({
  name: 'post',
  title: 'Entrada',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'URL de la entrada. Se genera automaticamente desde el titulo.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal Desktop',
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
      name: 'excerpt',
      title: 'Extracto',
      description: 'Resumen corto para listados y meta descripcion SEO (max. 200 caracteres).',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicacion',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return {
        ...selection,
        subtitle: author ? `Por ${author}` : 'Sin autor',
      };
    },
  },
});
