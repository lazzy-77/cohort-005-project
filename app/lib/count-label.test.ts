import { describe, expect, it } from "vitest";
import { countLabel, countNoun } from "./count-label";

describe("countLabel", () => {
  it("uses the singular for exactly one", () => {
    expect(countLabel(1, "lesson", "lessons")).toBe("1 lesson");
  });

  it("uses the plural for zero and for more than one", () => {
    expect(countLabel(0, "lesson", "lessons")).toBe("0 lessons");
    expect(countLabel(2, "lesson", "lessons")).toBe("2 lessons");
  });

  it("takes an irregular plural as given", () => {
    expect(countLabel(3, "category", "categories")).toBe("3 categories");
  });
});

describe("countNoun", () => {
  it("gives the singular for exactly one and the plural otherwise", () => {
    expect(countNoun(1, "course", "courses")).toBe("course");
    expect(countNoun(0, "course", "courses")).toBe("courses");
    expect(countNoun(5, "category", "categories")).toBe("categories");
  });
});
