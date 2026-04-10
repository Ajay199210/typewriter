import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { incorrectKeys } = await req.json() as { incorrectKeys: Record<string, number> };

  const topErrors = Object.entries(incorrectKeys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([key, count]) => `"${key}" (${count} mistake${count > 1 ? "s" : ""})`)
    .join(", ");

  const prompt = topErrors.length > 0
    ? `You are a concise typing coach. The user just finished a typing test. Their most frequent key mistakes: ${topErrors}. Give exactly 2-3 short, actionable tips — which keys to drill and how. No intro sentence, no markdown formatting, just plain text tips as a simple list using "- " bullets.`
    : `You are a concise typing coach. The user finished a typing test with zero errors. Give 2 short tips to push their speed further. No intro sentence, no markdown formatting, just plain text tips as a simple list using "- " bullets.`;

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    prompt,
    maxOutputTokens: 150,
  });

  return result.toUIMessageStreamResponse();
}
