import { defineField } from 'sanity';

export function createRequiredAltField(options?: {
  name?: string;
  title?: string;
  description?: string;
}) {
  return defineField({
    name: options?.name || 'alt',
    title: options?.title || 'Texto alternativo',
    type: 'string',
    description: options?.description || 'Obligatorio para SEO y accesibilidad.',
    validation: (Rule) => Rule.required().error('El texto alternativo es obligatorio para SEO y accesibilidad.'),
  });
}

export function createMobileImageField(options?: {
  name?: string;
  title?: string;
  description?: string;
}) {
  return defineField({
    name: options?.name || 'mobileImage',
    title: options?.title || 'Imagen mobile',
    type: 'image',
    description: options?.description || 'Sube la versión optimizada para pantallas pequeñas.',
    options: {
      hotspot: true,
      accept: 'image/webp,image/avif',
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texto alternativo mobile',
        type: 'string',
        description: 'Obligatorio para SEO y accesibilidad cuando exista la imagen mobile.',
        validation: (Rule) =>
          Rule.custom((value, context) => {
            if (context?.parent?.asset && !value) {
              return 'El texto alternativo mobile es obligatorio.';
            }
            return true;
          }),
      }),
    ],
    validation: (Rule) =>
      Rule.custom((value, context) => {
        if (context?.parent?.asset && !value?.asset) {
          return 'Debes subir también la versión mobile de esta imagen.';
        }
        return true;
      }),
  });
}
