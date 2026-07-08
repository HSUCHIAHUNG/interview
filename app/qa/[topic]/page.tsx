import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  getTopicFromDB,
  getTopicSlugsFromDB,
  getUserProgress,
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

  const progress = userId
    ? await getUserProgress(userId, topic, "qa")
    : { currentQuestion: 0, quizAnswers: null, qaAnswers: null };

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <QAClient
        slug={topic}
        meta={data.meta}
        questions={data.questions}
        initialCurrent={progress.currentQuestion}
        initialAnswers={progress.qaAnswers}
      />
    </main>
  );
}
