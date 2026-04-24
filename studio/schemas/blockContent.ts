import { defineArrayMember, defineField, defineType } from 'sanity';
import { createMobileImageField, createRequiredAltField } from './imageFields';

export default defineType({
  title: 'Contenido',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Bloque de texto',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Cita', value: 'blockquote' },
      ],
      lists: [
        { title: 'Vinetas', value: 'bullet' },
        { title: 'Numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrita', value: 'strong' },
          { title: 'Cursiva', value: 'em' },
          { title: 'Codigo', value: 'code' },
          { title: 'Subrayado', value: 'underline' },
        ],
        annotations: [
          {
            title: 'Enlace',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                title: 'Abrir en pestana nueva',
                name: 'blank',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/webp,image/avif',
      },
      fields: [
        createRequiredAltField(),
        createMobileImageField(),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Leyenda',
        }),
      ],
    }),
  ],
});
