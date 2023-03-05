import { compareWhens, parseWhen, whenAfter, whenBefore } from "./when"

describe(parseWhen, () => {
  test("2023", () => {
    expect(parseWhen("2023")).toEqual({ year: 2023 })
  })
  test("2023-03", () => {
    expect(parseWhen("2023-03")).toEqual({ year: 2023, month: 3 })
  })
  test("2023-3", () => {
    expect(parseWhen("2023-3")).toEqual({ year: 2023, month: 3 })
  })
  test("2023-03-04", () => {
    expect(parseWhen("2023-03-04")).toEqual({ year: 2023, month: 3, day: 4 })
  })
  test("2023-03-4", () => {
    expect(parseWhen("2023-03-4")).toEqual({ year: 2023, month: 3, day: 4 })
  })
  test("2023-3-4", () => {
    expect(parseWhen("2023-3-4")).toEqual({ year: 2023, month: 3, day: 4 })
  })

  test("0", () => {
    expect(parseWhen("0")).toEqual({ year: 0 })
  })
  test("-100", () => {
    expect(parseWhen("-100")).toEqual({ year: -100 })
  })
  test("-100-06-08", () => {
    expect(parseWhen("-100-06-08")).toEqual({ year: -100, month: 6, day: 8 })
  })

  test("error", () => {
    expect(() => parseWhen("error")).toThrow()
  })
})

describe(compareWhens, () => {
  test("sorts in asc order", () => {
    expect(
      [
        { year: 2023, month: 3, day: 4 },
        { year: 2023, month: 3, day: 6 },
        { year: 2023, month: 3, day: 3 },
      ].sort(compareWhens),
    ).toEqual([
      { year: 2023, month: 3, day: 3 },
      { year: 2023, month: 3, day: 4 },
      { year: 2023, month: 3, day: 6 },
    ])
  })
  test("year-level", () => {
    expect(compareWhens({ year: 2023 }, { year: 2020 })).toBeGreaterThan(0)
    expect(compareWhens({ year: 2020 }, { year: 2023 })).toBeLessThan(0)
    expect(compareWhens({ year: 2023, month: 4 }, { year: 2023 })).toEqual(0)
    expect(compareWhens({ year: 2023 }, { year: 2023, month: 3 })).toEqual(0)
    expect(
      compareWhens({ year: 2023 }, { year: 2023, month: 3, day: 4 }),
    ).toEqual(0)
  })
  test("month-level", () => {
    expect(
      compareWhens({ year: 2023, month: 3 }, { year: 2023, month: 1 }),
    ).toBeGreaterThan(0)
    expect(
      compareWhens({ year: 2023, month: 1 }, { year: 2023, month: 3 }),
    ).toBeLessThan(0)
    expect(
      compareWhens({ year: 2023, month: 4 }, { year: 2023, month: 4, day: 2 }),
    ).toEqual(0)
    expect(
      compareWhens({ year: 2023, month: 3, day: 1 }, { year: 2023, month: 3 }),
    ).toEqual(0)
  })
  test("day-level", () => {
    expect(
      compareWhens(
        { year: 2023, month: 3, day: 8 },
        { year: 2023, month: 3, day: 4 },
      ),
    ).toBeGreaterThan(0)
    expect(
      compareWhens(
        { year: 2023, month: 3, day: 4 },
        { year: 2023, month: 3, day: 8 },
      ),
    ).toBeLessThan(0)
    expect(
      compareWhens(
        { year: 2023, month: 3, day: 4 },
        { year: 2023, month: 3, day: 4 },
      ),
    ).toEqual(0)
  })
})

describe(whenAfter, () => {
  test("right order", () => {
    expect(whenAfter({ year: 2020 }, { year: 2023 })).toBe(false)
  })
})

describe(whenBefore, () => {
  test("right order", () => {
    expect(whenAfter({ year: 2023 }, { year: 2020 })).toBe(true)
  })
})
