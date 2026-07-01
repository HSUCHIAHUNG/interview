'use server'

import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { userTopicCompletions } from '@/lib/db/schema'

export async function toggleTopicCompletion(slug: string): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const [existing] = await db
    .select({ id: userTopicCompletions.id })
    .from(userTopicCompletions)
    .where(
      and(
        eq(userTopicCompletions.clerkId, userId),
        eq(userTopicCompletions.topicSlug, slug),
      ),
    )
    .limit(1)

  if (existing) {
    await db
      .delete(userTopicCompletions)
      .where(
        and(
          eq(userTopicCompletions.clerkId, userId),
          eq(userTopicCompletions.topicSlug, slug),
        ),
      )
    revalidatePath('/')
    return false
  } else {
    await db.insert(userTopicCompletions).values({ clerkId: userId, topicSlug: slug })
    revalidatePath('/')
    return true
  }
}
