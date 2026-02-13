import { db } from '~~/server/utilis/db'
import { task } from '~~/server/database/schema'
import { eq } from 'drizzle-orm'
import { auth } from '~~/server/utilis/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session) throw createError({ statusCode: 401, message: 'Unauthorized' })

 
  const id = event.context.params?.id

  if (!id) throw createError({ statusCode: 400, message: 'Missing task ID' })

  try {
 
    const result = await db.delete(task)
      .where(eq(task.id, id))
      .returning()

    if (result.length === 0) {
      throw createError({ statusCode: 404, message: 'Task not found' })
    }

    return { success: true, deletedId: id }
  } catch (error: any) {
    console.error("Delete Error:", error)
    throw createError({ 
      statusCode: 500, 
      message: error.message || 'Server error during deletion' 
    })
  }
})