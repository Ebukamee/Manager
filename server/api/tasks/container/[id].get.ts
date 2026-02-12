import { db } from "~~/server/utilis/db";
import { task } from "~~/server/database/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "~~/server/utilis/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  const containerId = getRouterParam(event, 'id');

  return await db.select()
    .from(task)
    .where(eq(task.containerId, containerId))
    .orderBy(task.createdAt);
});