import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const folders = pgTable('folders', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  parentId: uuid('parent_id'),
  // path & depth akan kita buat via raw SQL supaya tipe 'ltree' terset sempurna
  depth: integer('depth').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  folderId: uuid('folder_id').notNull(),
  name: varchar('name', { length: 512 }).notNull(),
  ext: varchar('ext', { length: 32 }),
  size: integer('size').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});