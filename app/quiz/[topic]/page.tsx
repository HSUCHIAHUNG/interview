import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  getTopicFromDB,
  getTopicSlugsFromDB,
  getUserProgress,
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
  const [data, { userId }] = await Promise.all([getTopicFromDB(topic), auth()]);
  if (!data) notFound();

  const progress = userId
    ? await getUserProgress(userId, topic, "quiz")
    : { currentQuestion: 0, quizAnswers: null, qaAnswers: null };

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-xl mx-auto mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-300 transition"
        >
          ← 回首頁
        </Link>
      </div>
      <QuizClient
        slug={topic}
        meta={data.meta}
        questions={data.questions}
        initialCurrent={progress.currentQuestion}
        initialAnswers={progress.quizAnswers}
      />
    </main>
  );
}
