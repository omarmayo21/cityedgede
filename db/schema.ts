import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Projects ---
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(), // e.g. "almaqsad-park"
  status: text('status'), // e.g. "Under Construction"
  categoryId: integer('category_id'), // e.g. residential, commercial
  heroImage: text('hero_image'),
  masterplanImage: text('masterplan_image'),
  videoUrl: text('video_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projectTranslations = pgTable('project_translations', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  language: text('language').notNull(), // 'en' or 'ar'
  title: text('title').notNull(),
  description: text('description'),
  locationText: text('location_text'),
  projectType: text('project_type'),
  ctaText: text('cta_text'),
  ctaLink: text('cta_link'),
});

// --- Galleries ---
export const galleries = pgTable('galleries', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  imageUrl: text('image_url').notNull(),
  displayOrder: integer('display_order').default(0),
});

// --- Amenities ---
export const amenities = pgTable('amenities', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  iconUrl: text('icon_url'),
});

export const amenityTranslations = pgTable('amenity_translations', {
  id: serial('id').primaryKey(),
  amenityId: integer('amenity_id').notNull().references(() => amenities.id),
  language: text('language').notNull(),
  title: text('title').notNull(),
  description: text('description'),
});

// --- Unit Types ---
export const unitTypes = pgTable('unit_types', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  imageUrl: text('image_url'),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  areaMin: integer('area_min'),
  areaMax: integer('area_max'),
});

export const unitTypeTranslations = pgTable('unit_type_translations', {
  id: serial('id').primaryKey(),
  unitTypeId: integer('unit_type_id').notNull().references(() => unitTypes.id),
  language: text('language').notNull(),
  title: text('title').notNull(),
});

// --- Pages (Static Pages Content) ---
export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(), // e.g. "about-us"
});

export const pageTranslations = pgTable('page_translations', {
  id: serial('id').primaryKey(),
  pageId: integer('page_id').notNull().references(() => pages.id),
  language: text('language').notNull(),
  title: text('title').notNull(),
  content: jsonb('content'), // can store flexible sections
});

// --- Contact Submissions ---
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  country: text('country').notNull(),
  message: text('message'),
  sourcePage: text('source_page'),
  createdAt: timestamp('created_at').defaultNow(),
});

// --- Relations ---
export const projectsRelations = relations(projects, ({ many }) => ({
  translations: many(projectTranslations),
  galleries: many(galleries),
  amenities: many(amenities),
  unitTypes: many(unitTypes),
}));

export const pagesRelations = relations(pages, ({ many }) => ({
  translations: many(pageTranslations),
}));
