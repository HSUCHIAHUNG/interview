import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { question, referenceAnswer, userAnswer } = await request.json();

  if (!userAnswer?.trim()) {
    return Response.json({ error: "請輸入答案" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: `你是一位資深前端工程師面試官，正在評估應試者的口頭回答。
請用繁體中文給出簡潔的評估回饋，格式如下（請嚴格遵守）：

✅ **答對的部分**
（列出答案中正確的概念，若完全沒答對則寫「無」）

⚠️ **漏掉的關鍵概念**
（列出重要但未提及的概念，若全都說到則寫「無」）

💡 **一句話補充**
（用一句話點出最重要的核心概念）

🎯 **分數：X / 5**
（1=完全不會，3=部分理解，5=完整清楚）

評估標準：看語意是否正確，不要求用字完全一致。`,
    });

    const result = await model.generateContentStream(
      `題目：${question}\n\n參考答案：${referenceAnswer}\n\n應試者的回答：${userAnswer}`
    );

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "AI 評估暫時無法使用，請稍後再試。";
    return Response.json({ error: message }, { status: 500 });
  }
}
