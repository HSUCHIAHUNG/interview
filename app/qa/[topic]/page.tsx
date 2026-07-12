import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  getTopicFromDB,
  getTopicSlugsFromDB,
  getUserProgress,
  getStarredQuestionIds,
} from "@/lib/db/queries";
import QAClient from "./QAClient";

export async function generateStaticParams() {
  const slugs = await getTopicSlugsFromDB();
  return slugs.map((slug) => ({ topic: slug }));
}

export default async function QAPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const [data, { userId }] = await Promise.all([getTopicFromDB(topic), auth()]);
  if (!data) notFound();

  const [progress, starredIds] = await Promise.all([
    userId ? getUserProgress(userId, topic, "qa") : Promise.resolve({ currentQuestion: 0, quizAnswers: null, qaAnswers: null }),
    userId ? getStarredQuestionIds(userId, topic) : Promise.resolve(new Set<number>()),
  ]);

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <QAClient
        slug={topic}
        meta={data.meta}
        questions={data.questions}
        initialCurrent={progress.currentQuestion}
        initialAnswers={progress.qaAnswers}
        isLoggedIn={!!userId}
        initialStarred={[...starredIds]}
      />
    </main>
  );
}
