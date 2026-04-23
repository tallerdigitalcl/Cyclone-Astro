import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'default',
  title: 'Astro Cyclone',

  // Las variables SANITY_STUDIO_* son inyectadas automáticamente por Sanity CLI
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool(), // Herramienta para probar queries GROQ en tiempo real
  ],

  schema: {
    types: schemaTypes,
  },
});
