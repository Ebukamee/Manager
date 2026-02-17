import { db } from "~~/server/utilis/db";
import { user, task, container } from "~~/server/database/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { getRoastPrompt } from "~~/server/utilis/roaster";
import { callGemini } from "~~/server/utilis/ai-handler";
import { sendRoastEmail } from "~~/server/utilis/email";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, 'Authorization');
  
  if (authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const now = new Date();

  const targets = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    jobTitle: user.jobTitle,
    bio: user.bio,
    roastLevel: user.roastLevel,
    tasks: sql`array_agg(json_build_object(
      'title', ${task.title}, 
      'containerName', ${container.name}
    ))`
  })
  .from(user)
  .innerJoin(container, eq(user.id, container.userId))
  .innerJoin(task, eq(container.id, task.containerId))
  .where(
    and(
      eq(task.status, 'pending'),
      lt(task.dueAt, now)
    )
  )
  .groupBy(user.id);

  if (targets.length === 0) {
    return { message: "No overdue tasks found." };
  }

  for (const target of targets) {
    try {
      const { persona, material } = getRoastPrompt(target as any, target.tasks as any);
      
      const roastText = await callGemini(persona, material);
      await sendRoastEmail(target.email, roastText);
      
      console.log(`Roasted ${target.email} successfully.`);
    } catch (err) {
      console.error(`Failed to roast user ${target.id}:`, err);
    }
  }

  return { 
    success: true, 
    roastedCount: targets.length 
  };
});