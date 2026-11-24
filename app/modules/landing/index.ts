import { countLabel as label } from "./lib/count-label";

/**
 * A count with its noun, singular for exactly one: "1 lesson", "0 lessons",
 * "12 lessons". Safe for the browser; the landing page uses it for course
 * cards and catalogue figures.
 */
export function countLabel(value: number, singular: string, plural: string) {
  return label(value, singular, plural);
}
