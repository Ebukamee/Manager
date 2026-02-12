import { db } from "~~/server/utilis/db";
import { container } from "~~/server/database/schema";
import { auth } from "~~/server/utilis/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session) throw createError({ statusCode: 401 });

  const body = await readBody(event);

  const [newRow] = await db.insert(container).values({
    userId: session.user.id,
    name: body.name,
    type: body.type || 'custom',
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
    isArchived: false
  }).returning();

  return newRow;
});