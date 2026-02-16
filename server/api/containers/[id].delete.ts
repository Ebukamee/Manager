import { db } from "~~/server/utilis/db";
import { container } from "~~/server/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "~~/server/utilis/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing ID" });

  // 1. Verify existence, ownership, and that it IS a custom container
  const target = await db.query.container.findFirst({
    where: and(
      eq(container.id, id),
      eq(container.userId, session.user.id)
    )
  });

  if (!target) throw createError({ statusCode: 404, statusMessage: "Not found" });
  
  if (target.type !== 'custom') {
    throw createError({ 
      statusCode: 403, 
      statusMessage: "Only custom containers can be deleted manually." 
    });
  }

  // 2. Delete (Tasks will cascade delete if your DB schema is set up for it)
  await db.delete(container).where(eq(container.id, id));

  return { success: true };
});