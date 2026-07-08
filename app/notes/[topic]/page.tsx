import { notFound } from "next/navigation";
import Link from "next/link";
import { hasNotesPage } from "@/lib/topics";
import { getTopicFromDB, getTopicSlugsFromDB } from "@/lib/db/queries";
import { getMethodChallenge } from "@/lib/array-challenges";

export async function generateStaticParams() {
  const slugs = await getTopicSlugsFromDB();
  return slugs.map((slug) => ({ topic: slug }));
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const result: React.ReactNode[] = [];
  let tableLines: string[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockIdx = 0;

  const flushTable = (key: string) => {
    if (tableLines.length < 2) return;
    const headers = tableLines[0]
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    const rows = tableLines.slice(2).map((row) =>
      row
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim())
    );
    result.push(
      <div key={key} className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-800">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="border border-gray-700 px-3 py-2 text-left font-semibold text-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="border border-gray-700 px-3 py-2 text-gray-400"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableLines = [];
  };

  lines.forEach((line, i) => {
    // fenced code block
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        if (tableLines.length > 0) flushTable(`table-${i}`);
        inCodeBlock = true;
        codeBlockLines = [];
        codeBlockIdx = i;
      } else {
        inCodeBlock = false;
        result.push(
          <pre
            key={`code-${codeBlockIdx}`}
            className="bg-gray-900 text-green-300 text-sm rounded-lg px-4 py-3 overflow-x-auto my-2 font-mono whitespace-pre"
          >
            {codeBlockLines.join("\n")}
          </pre>
        );
        codeBlockLines = [];
      }
      return;
    }
    if (inCodeBlock) {
      // closing fence 緊貼在最後一行程式碼後（e.g. `}``` `）
      if (line.endsWith("```")) {
        const content = line.slice(0, -3).trimEnd();
        if (content) codeBlockLines.push(content);
        inCodeBlock = false;
        result.push(
          <pre
            key={`code-${codeBlockIdx}`}
            className="bg-gray-900 text-green-300 text-sm rounded-lg px-4 py-3 overflow-x-auto my-2 font-mono whitespace-pre"
          >
            {codeBlockLines.join("\n")}
          </pre>
        );
        codeBlockLines = [];
      } else {
        codeBlockLines.push(line);
      }
      return;
    }

    if (line.startsWith("|")) {
      tableLines.push(line);
      return;
    }
    if (tableLines.length > 0) {
      flushTable(`table-${i}`);
    }
    if (line.startsWith("- ")) {
      result.push(
        <li key={i} className="ml-4 text-gray-400 list-disc list-inside">
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    } else if (line.trim() === "") {
      result.push(<div key={i} className="h-2" />);
    } else {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      result.push(
        <p
          key={i}
          className="text-gray-400 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    }
  });

  if (tableLines.length > 0) flushTable("table-end");

  return result;
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (!hasNotesPage(topic)) notFound();

  const data = await getTopicFromDB(topic);
  if (!data) notFound();

  const practiceEntry = getMethodChallenge(topic);
  const notes = practiceEntry
    ? practiceEntry.notes
    : (await import(`@/topics/${topic}/notes`)).notes;

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-300 transition"
        >
          ← 回首頁
        </Link>

        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-100">{notes.title}</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {data.meta.category} · {data.meta.description}
          </p>
        </div>

        <div className="space-y-6">
          {notes.sections.map(
            (section: { heading: string; content: string }, i: number) => (
              <div
                key={i}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-100 mb-3">
                  {section.heading}
                </h2>
                <div className="space-y-1">
                  {renderContent(section.content)}
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-8 flex gap-3">
          {practiceEntry ? (
            <Link
              href={`/practice/${topic}`}
              className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-3 rounded-xl transition"
            >
              實作練習
            </Link>
          ) : (
            <Link
              href={`/quiz/${topic}`}
              className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-3 rounded-xl transition"
            >
              開始測驗
            </Link>
          )}
          <Link
            href="/"
            className="flex-1 text-center bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-200 text-sm font-semibold py-3 rounded-xl transition"
          >
            回首頁
          </Link>
        </div>
      </div>
    </main>
  );
}
