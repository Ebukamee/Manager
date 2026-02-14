import { db } from '~~/server/utilis/db'
import { container } from '~~/server/database/schema'
import { eq, and, or, gte, isNull } from 'drizzle-orm'
import { auth } from '~~/server/utilis/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session) throw createError({ statusCode: 401 })

  const now = new Date()

  return await db.select()
    .from(container)
    .where(
      and(
        eq(container.userId, session.user.id),
        or(
          isNull(container.expiresAt),
          gte(container.expiresAt, now)
        )
      )
    )
})