import { db } from "~~/server/utilis/db";
import { task, container } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "~~/server/utilis/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  // Fetch tasks belonging to containers owned by the user
  return await db.select({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    category:task.category,
    priority: task.priority,
    dueAt: task.dueAt,
    containerName: container.name
  })
  .from(task)
  .innerJoin(container, eq(task.containerId, container.id))
  .where(eq(container.userId, session.user.id))
  .orderBy(task.dueAt);
});