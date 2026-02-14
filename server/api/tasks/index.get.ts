import { db } from "~~/server/utilis/db";
import { task, container } from "~~/server/database/schema";
import { eq, and, or, gte, isNull } from "drizzle-orm";
import { auth } from "~~/server/utilis/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  const now = new Date();

  // Fetch only active tasks (those whose containers haven't expired)
  return await db.select({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    category: task.category,
    priority: task.priority,
    dueAt: task.dueAt,
    containerName: container.name
  })
  .from(task)
  .innerJoin(container, eq(task.containerId, container.id))
  .where(
    and(
      eq(container.userId, session.user.id),
      // Filter logic: Show if container has no expiry OR expiry is in the future
      or(
        isNull(container.expiresAt),
        gte(container.expiresAt, now)
      )
    )
  )
  .orderBy(task.dueAt);
});