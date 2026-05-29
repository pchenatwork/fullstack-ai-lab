// Single-turn RAG contract: send one question, get one plain-text answer.
// QaEntry is the client-side session-log record (not part of the API contract).

export interface AskRequest {
  question: string;
}

export interface AskResponse {
  answer: string;
}

export interface QaEntry {
  id: string;
  question: string;
  answer: string | null;
  status: "pending" | "done" | "error";
}
