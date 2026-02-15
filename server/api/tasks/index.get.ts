import { db } from "~~/server/utilis/db";
import { task, container } from "~~/server/database/schema";
import { eq, and, or, gte, isNull } from "drizzle-orm";
import { auth } from "~~/server/utilis/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  // 1. Get the filter from the URL query (e.g., /api/tasks?period=daily)
  const query = getQuery(event);
  const period = query.period as string || 'all'; 

  const now = new Date();

  // 2. Build our base conditions
  const conditions = [
    eq(container.userId, session.user.id),
    or(
      isNull(container.expiresAt),
      gte(container.expiresAt, now)
    )
  ];

  // 3. If period is NOT 'all', add the type filter to the SQL query
  if (period !== 'all') {
    conditions.push(eq(container.type, period));
  }

  return await db.select({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    category: task.category,
    priority: task.priority,
    dueAt: task.dueAt,
    containerId: task.containerId, 
    containerName: container.name,
    containerType: container.type
  })
  .from(task)
  .innerJoin(container, eq(task.containerId, container.id))
  .where(and(...conditions)) // Spread the conditions array here
  .orderBy(task.dueAt);
});