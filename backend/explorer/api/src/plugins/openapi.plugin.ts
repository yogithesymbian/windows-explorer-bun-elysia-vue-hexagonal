import { openapi } from '@elysiajs/openapi';

export const openApiPlugin = openapi({
  path: '/docs',
  specPath: '/docs/openapi.json',
  documentation: {
    servers: [
      { url: "/"}
    ],
    info: {
      title: 'Explorer API',
      version: '1.0.0',
      contact: {
        name: "Yogi Arif Widodo",
        email: "yogi@yogiveloper.com"
      },
      description: 'File & Folder explorer service with ltree + FTS'
    },
    tags: [
      { name: 'Folders', description: 'Hierarki & navigasi folder' },
      { name: 'Files', description: 'Listing & pencarian files' },
      { name: 'Search', description: 'Global search' }
    ]
  }
});
