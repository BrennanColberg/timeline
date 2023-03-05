export type When = { year: number; month?: number; day?: number }

export function parseWhen(rawWhen: string): When {
  const match = /^(-?\d+)(?:-(\d+))?(?:-(\d+))?$/.exec(rawWhen)
  if (match === null) throw new Error("invalid when: " + rawWhen)
  const [, rawYear, rawMonth, rawDay] = match
  const year = parseInt(rawYear)
  const month = rawMonth === undefined ? undefined : parseInt(rawMonth)
  const day = rawDay === undefined ? undefined : parseInt(rawDay)
  return { year, month, day }
}

export function compareWhens(a: When, b: When): number {
  // if years different
  const dYear = a.year - b.year
  if (dYear) return dYear
  if (!a.month || !b.month) return 0 // same year, one has no month => equal
  // if months defined & different
  const dMonth = a.month - b.month
  if (dMonth) return dMonth
  if (!a.day || !b.day) return 0 // same month, one has no day => equal
  // if days defined & different
  return a.day - b.day
}

export function whensEqual(a: When, b: When): boolean {
  return compareWhens(a, b) === 0
}
export function whenBefore(a: When, b: When): boolean {
  return compareWhens(a, b) < 0
}
export function whenAtOrBefore(a: When, b: When): boolean {
  return compareWhens(a, b) <= 0
}
export function whenAfter(a: When, b: When): boolean {
  return compareWhens(a, b) > 0
}
export function whenAtOrAfter(a: When, b: When): boolean {
  return compareWhens(a, b) >= 0
}

export function whenToString(when: When): string {
  return when.year + ""
}
