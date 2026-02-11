import { db } from '~~/server/utilis/db'
import { container } from '~~/server/database/schema'
import { auth } from '~~/server/utilis/auth'
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401, message: "Unauthorized" });

  // Fetch all active (non-archived) containers for this user
  return await db.select()
    .from(container)
    .where(
      and(
        eq(container.userId, session.user.id),
        eq(container.isArchived, false)
      )
    );
});