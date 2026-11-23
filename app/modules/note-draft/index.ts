import { readNoteDraft, type NoteDraft } from "./lib/note-draft";

export type { NoteDraft };

/**
 * What the Lesson note form shows about the text being typed: the character
 * count against the limit, whether it differs from the saved Note, and
 * whether Save would be accepted by the action.
 */
export function describeNoteDraft(
  draft: string,
  savedBody: string | null | undefined
): NoteDraft {
  return readNoteDraft(draft, savedBody ?? "");
}
