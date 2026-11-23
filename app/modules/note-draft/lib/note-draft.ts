import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type NoteDraft = {
  length: number;
  limit: number;
  tooLong: boolean;
  empty: boolean;
  unsaved: boolean;
  canSave: boolean;
};

export function readNoteDraft(draft: string, savedBody: string): NoteDraft {
  // The action trims before it checks the length, so the form does too.
  const trimmed = draft.trim();
  const tooLong = trimmed.length > MAX_NOTE_LENGTH;
  const empty = trimmed.length === 0;
  // Saved bodies are already trimmed: the action trims before it writes.
  const unsaved = trimmed !== savedBody;
  return {
    length: trimmed.length,
    limit: MAX_NOTE_LENGTH,
    tooLong,
    empty,
    unsaved,
    canSave: unsaved && !empty && !tooLong,
  };
}
