import { defineField, defineType } from 'sanity';
import { createMobileImageField, createRequiredAltField } from './imageFields';

export default defineType({
  name: 'post',
  title: 'Noticias',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'home', title: 'Home' },
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Contenido' },
    { name: 'gallery', title: 'Galeria' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titulo de noticia',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required().min(5).max(140),
    }),
    defineField({
      name: 'homeTitle',
      title: 'Titulo de noticia en el home',
      type: 'string',
      group: 'home',
      validation: (Rule) => Rule.required().min(5).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'URL de la noticia. Se genera automaticamente desde el titulo.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoria de noticia',
      type: 'string',
      group: 'home',
      options: {
        list: [
          { title: 'TIPS', value: 'tips' },
          { title: 'Eventos', value: 'eventos' },
          { title: 'Nuevo', value: 'nuevo' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto de noticia',
      description: 'Resumen corto para usar en el home y meta descripcion SEO.',
      type: 'text',
      rows: 4,
      group: 'home',
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: 'homeImage',
      title: 'Imagen destacada para el Home (Desktop)',
      type: 'image',
      group: 'home',
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
      name: 'publishedAt',
      title: 'Fecha de publicacion',
      type: 'datetime',
      group: 'general',
    }),
    defineField({
      name: 'heroImages',
      title: 'Slider de imagenes Hero',
      type: 'array',
      group: 'hero',
      of: [
        {
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
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Contenido de la noticia',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'galleryPhotos',
      title: 'Galeria de fotos',
      type: 'array',
      group: 'gallery',
      of: [
        {
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
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'homeImage',
    },
    prepare({ title, subtitle, media }) {
      const categoryMap: Record<string, string> = {
        tips: 'TIPS',
        eventos: 'Eventos',
        nuevo: 'Nuevo',
      };

      return {
        title,
        subtitle: subtitle ? categoryMap[subtitle] || subtitle : 'Sin categoria',
        media,
      };
    },
  },
});
