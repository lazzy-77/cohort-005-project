/**
 * A count with its noun, singular for exactly one: "1 lesson", "0 lessons",
 * "12 lessons". Safe for the browser.
 */
export function countLabel(value: number, singular: string, plural: string) {
  return `${value} ${value === 1 ? singular : plural}`;
}
