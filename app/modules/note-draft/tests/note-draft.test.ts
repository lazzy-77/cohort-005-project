import { describe, it, expect } from "vitest";
import { describeNoteDraft } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

describe("describeNoteDraft", () => {
  it("cannot save an empty draft when there is no saved Note", () => {
    expect(describeNoteDraft("", null)).toEqual({
      length: 0,
      limit: MAX_NOTE_LENGTH,
      tooLong: false,
      empty: true,
      unsaved: false,
      canSave: false,
    });
  });

  it("treats whitespace only as empty", () => {
    const draft = describeNoteDraft("   \n ", undefined);
    expect(draft.empty).toBe(true);
    expect(draft.canSave).toBe(false);
  });

  it("can save new text", () => {
    const draft = describeNoteDraft("Generics are like parameters", null);
    expect(draft.unsaved).toBe(true);
    expect(draft.canSave).toBe(true);
    expect(draft.length).toBe(28);
  });

  it("has nothing to save when the draft matches the saved Note", () => {
    const draft = describeNoteDraft("Same text", "Same text");
    expect(draft.unsaved).toBe(false);
    expect(draft.canSave).toBe(false);
  });

  it("ignores surrounding whitespace when comparing with the saved Note", () => {
    expect(describeNoteDraft("  Same text\n", "Same text").unsaved).toBe(false);
  });

  it("counts the characters the action will save, without surrounding whitespace", () => {
    expect(describeNoteDraft(" ab ", null).length).toBe(2);
  });

  it("allows a draft at exactly the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH), null);
    expect(draft.tooLong).toBe(false);
    expect(draft.canSave).toBe(true);
  });

  it("blocks a draft one character over the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH + 1), null);
    expect(draft.tooLong).toBe(true);
    expect(draft.canSave).toBe(false);
  });

  it("does not count trailing whitespace towards the limit", () => {
    const draft = describeNoteDraft(`${"a".repeat(MAX_NOTE_LENGTH)}  `, null);
    expect(draft.tooLong).toBe(false);
    expect(draft.length).toBe(MAX_NOTE_LENGTH);
  });
});
