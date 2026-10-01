import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or identifier
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: text('role').default('Staff Engineer'),
  status: text('status').default('active'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  status: text('status').default('active'), // 'planning', 'in_progress', 'deployed', 'archived'
  priority: text('priority').default('high'),
  ownerId: integer('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Project Interactions table (Interactions between Users and Projects)
export const projectInteractions = pgTable('project_interactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),
  interactionType: text('interaction_type').notNull(), // 'lead', 'code_review', 'deployment', 'feature_commit', 'incident_mitigation'
  roleInProject: text('role_in_project').default('Contributor'), // 'Project Lead', 'Security Reviewer', 'Core Dev', 'DevOps Engineer'
  activitySummary: text('activity_summary'),
  commitsCount: integer('commits_count').default(1),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  interactions: many(projectInteractions),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  interactions: many(projectInteractions),
}));

export const projectInteractionsRelations = relations(projectInteractions, ({ one }) => ({
  user: one(users, {
    fields: [projectInteractions.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [projectInteractions.projectId],
    references: [projects.id],
  }),
}));
