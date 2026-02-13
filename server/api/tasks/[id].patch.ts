import { db } from '~~/server/utilis/db'
import { task } from '~~/server/database/schema'
import { eq } from 'drizzle-orm'
import { auth } from '~~/server/utilis/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const [updatedTask] = await db.update(task)
    .set({ status: body.status })
    .where(eq(task.id, id))
    .returning()

  return updatedTask
})