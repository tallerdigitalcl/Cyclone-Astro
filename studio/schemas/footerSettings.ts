import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'nuestroMundoTitulo',
      title: 'Titulo Nuestro mundo',
      type: 'string',
      initialValue: 'Nuestro mundo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nuestroMundoLinks',
      title: 'Links Nuestro mundo',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Texto del link',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              description: 'Puede ser una ruta interna como /concesionarios o una URL externa.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'blank',
              title: 'Abrir en nueva pestana',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
        subtitle: 'Links de Nuestro mundo',
      };
    },
  },
});
