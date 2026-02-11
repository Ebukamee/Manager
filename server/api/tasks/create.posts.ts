// server/api/tasks/create.post.ts
import { db } from '~~/server/utilis/db'
import { task } from '~~/server/database/schema'
import { auth } from '~~/server/utilis/auth'

export default defineEventHandler(async (event: any) => {
  const session = await auth.handler(event)
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)

  // Insert into Drizzle
  const [newTask] = await db.insert(task).values({
    containerId: body.containerId,
    title: body.title,
    description: body.description || '',
    priority: body.priority || 'medium',
    status: 'pending'
  }).returning()

  return newTask
})