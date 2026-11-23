import { useState } from "react";
import { useFetcher } from "react-router";
import { Lock, NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import { describeNoteDraft, type NoteDraft } from "~/modules/note-draft";

// Laid out like the Questions & Discussion card further down the Lesson page,
// so the two read as one set of tools for the Student.
export function LessonNote({
  note,
}: {
  note: { body: string; updatedAt: string } | null;
}) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [body, setBody] = useState(note?.body ?? "");
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.state === "idle" ? fetcher.data?.error : undefined;
  const draft = describeNoteDraft(body, note?.body);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <LessonNoteHeader />

        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            rows={5}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Key ideas, questions to come back to, code to try..."
            aria-label="Your notes"
            className="resize-y"
          />
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || !draft.canSave}
            >
              {isSaving ? "Saving..." : "Save note"}
            </Button>
            <NoteStatus
              error={error}
              draft={draft}
              updatedAt={note?.updatedAt}
            />
            <CharacterCount draft={draft} />
          </div>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function LessonNoteHeader() {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <NotebookPen className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Your notes</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Jot things down while you watch. Your notes for every lesson are on
          your Saved page.
        </p>
      </div>
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Only you can see this
      </span>
    </div>
  );
}

function CharacterCount({ draft }: { draft: NoteDraft }) {
  return (
    <span
      className={cn(
        "ml-auto text-xs",
        draft.tooLong ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {draft.length} / {draft.limit}
    </span>
  );
}

function NoteStatus({
  error,
  draft,
  updatedAt,
}: {
  error: string | undefined;
  draft: NoteDraft;
  updatedAt: string | undefined;
}) {
  if (error) return <span className="text-sm text-destructive">{error}</span>;
  if (draft.unsaved && draft.empty) {
    return (
      <span className="text-xs text-muted-foreground">
        A note cannot be empty
      </span>
    );
  }
  if (draft.unsaved) {
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }
  if (!updatedAt) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Saved {formatRelativeTime(updatedAt)}
    </span>
  );
}
