import { db } from './index.ts';
import { users, projects, projectInteractions } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface UserProjectInteractionRecord {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userAvatar?: string | null;
  projectId: number;
  projectName: string;
  projectSlug: string;
  projectStatus: string | null;
  interactionType: string;
  roleInProject: string | null;
  activitySummary: string | null;
  commitsCount: number | null;
  lastActiveAt: Date | null;
  createdAt: Date | null;
}

export async function getAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users from database.', { cause: error });
  }
}

export async function getAllProjects() {
  try {
    const results = await db
      .select({
        id: projects.id,
        name: projects.name,
        slug: projects.slug,
        description: projects.description,
        status: projects.status,
        priority: projects.priority,
        ownerId: projects.ownerId,
        ownerName: users.fullName,
        ownerEmail: users.email,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .leftJoin(users, eq(projects.ownerId, users.id))
      .orderBy(desc(projects.createdAt));
    return results;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects from database.', { cause: error });
  }
}

export async function getAllInteractions(): Promise<UserProjectInteractionRecord[]> {
  try {
    const results = await db
      .select({
        id: projectInteractions.id,
        userId: projectInteractions.userId,
        userName: users.fullName,
        userEmail: users.email,
        userAvatar: users.avatarUrl,
        projectId: projectInteractions.projectId,
        projectName: projects.name,
        projectSlug: projects.slug,
        projectStatus: projects.status,
        interactionType: projectInteractions.interactionType,
        roleInProject: projectInteractions.roleInProject,
        activitySummary: projectInteractions.activitySummary,
        commitsCount: projectInteractions.commitsCount,
        lastActiveAt: projectInteractions.lastActiveAt,
        createdAt: projectInteractions.createdAt,
      })
      .from(projectInteractions)
      .innerJoin(users, eq(projectInteractions.userId, users.id))
      .innerJoin(projects, eq(projectInteractions.projectId, projects.id))
      .orderBy(desc(projectInteractions.lastActiveAt));
    return results;
  } catch (error) {
    console.error('Error fetching project interactions:', error);
    throw new Error('Failed to fetch project interactions from database.', { cause: error });
  }
}

export async function insertUser(userData: {
  uid: string;
  fullName: string;
  email: string;
  role?: string;
}) {
  try {
    const [created] = await db
      .insert(users)
      .values({
        uid: userData.uid,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 'Staff Engineer',
        status: 'active',
      })
      .returning();
    return created;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw new Error('Failed to insert user.', { cause: error });
  }
}

export async function insertProject(projectData: {
  name: string;
  slug: string;
  description: string;
  priority?: string;
  ownerId?: number;
}) {
  try {
    const [created] = await db
      .insert(projects)
      .values({
        name: projectData.name,
        slug: projectData.slug,
        description: projectData.description,
        priority: projectData.priority || 'high',
        status: 'active',
        ownerId: projectData.ownerId,
      })
      .returning();
    return created;
  } catch (error) {
    console.error('Error inserting project:', error);
    throw new Error('Failed to insert project.', { cause: error });
  }
}

export async function insertInteraction(interactionData: {
  userId: number;
  projectId: number;
  interactionType: string;
  roleInProject: string;
  activitySummary: string;
  commitsCount?: number;
}) {
  try {
    const [created] = await db
      .insert(projectInteractions)
      .values({
        userId: interactionData.userId,
        projectId: interactionData.projectId,
        interactionType: interactionData.interactionType,
        roleInProject: interactionData.roleInProject,
        activitySummary: interactionData.activitySummary,
        commitsCount: interactionData.commitsCount || 1,
      })
      .returning();
    return created;
  } catch (error) {
    console.error('Error inserting interaction:', error);
    throw new Error('Failed to insert interaction.', { cause: error });
  }
}
