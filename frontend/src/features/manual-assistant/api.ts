import type { AskRequest, AskResponse } from "./types";

const BASE = import.meta.env.VITE_API_BASE_URL;

// POST the question to the Ask endpoint, get a plain-text answer back.
// NOTE: adjust the path "/api/ask" to match your actual RAG endpoint.
export async function askManual(question: string): Promise<AskResponse> {
  const res = await fetch(`${BASE}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question } satisfies AskRequest),
  });
  if (!res.ok) {
    throw new Error(`Ask failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
