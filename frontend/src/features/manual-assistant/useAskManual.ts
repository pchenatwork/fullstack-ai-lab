import { useMutation } from "@tanstack/react-query";
import { askManual } from "./api";
import { useQaStore } from "./store";

// Wraps the single-turn ask call as a mutation (an action, not a cached read).
// Flow: append a pending entry, fire the call, then patch the entry with the answer
// or an error status. Each ask is independent — no conversation history is sent.
export function useAskManual() {
  const add = useQaStore((s) => s.add);
  const patch = useQaStore((s) => s.patch);

  const mutation = useMutation({
    mutationFn: (question: string) => askManual(question),
  });

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    const id = crypto.randomUUID();
    add({ id, question: trimmed, answer: null, status: "pending" });

    mutation.mutate(trimmed, {
      onSuccess: (res) => patch(id, { answer: res.answer, status: "done" }),
      onError: () =>
        patch(id, { answer: "Sorry — something went wrong.", status: "error" }),
    });
  }

  return { ask, isPending: mutation.isPending };
}
