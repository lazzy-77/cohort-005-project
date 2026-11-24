/** The noun for a count: the singular for exactly one, the plural otherwise. */
export function countNoun(value: number, singular: string, plural: string) {
  return value === 1 ? singular : plural;
}

/**
 * A count with its noun, singular for exactly one: "1 lesson", "0 lessons",
 * "12 lessons". Safe for the browser.
 */
export function countLabel(value: number, singular: string, plural: string) {
  return `${value} ${countNoun(value, singular, plural)}`;
}
