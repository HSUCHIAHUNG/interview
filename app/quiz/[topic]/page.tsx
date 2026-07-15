import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  getTopicFromDB,
  getTopicSlugsFromDB,
  getUserProgress,
  getStarredQuestionIds,
  getTopicNavInfo,
} from "@/lib/db/queries";
import QuizClient from "./QuizClient";

export async function generateStaticParams() {
  const slugs = await getTopicSlugsFromDB();
  return slugs.map((slug) => ({ topic: slug }));
}

export default async function QuizTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const [data, { userId }, navInfo] = await Promise.all([getTopicFromDB(topic), auth(), getTopicNavInfo(topic)]);
  if (!data) notFound();

  const [progress, starredIds] = await Promise.all([
    userId ? getUserProgress(userId, topic, "quiz") : Promise.resolve({ currentQuestion: 0, quizAnswers: null, qaAnswers: null }),
    userId ? getStarredQuestionIds(userId, topic) : Promise.resolve(new Set<number>()),
  ]);

  const backHref = navInfo
    ? `/?theme=${encodeURIComponent(navInfo.theme)}${navInfo.subCategory ? `&sub=${encodeURIComponent(navInfo.subCategory)}` : ''}`
    : '/'
  const backLabel = navInfo?.subCategory ?? navInfo?.theme ?? '首頁'

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <QuizClient
        slug={topic}
        meta={data.meta}
        questions={data.questions}
        initialCurrent={progress.currentQuestion}
        initialAnswers={progress.quizAnswers}
        isLoggedIn={!!userId}
        initialStarred={[...starredIds]}
        backHref={backHref}
        backLabel={backLabel}
      />
    </main>
  );
}
