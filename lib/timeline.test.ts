import { attemptToPlaceCard, GameConfig, GameState } from "./timeline"

describe(attemptToPlaceCard, () => {
  const atYear = (year: number): GameState => ({
    config: { mistakesAllowed: 0, blindMode: false, decks: [] },
    finished: false,
    mistakesRemaining: 0,
    deck: [],
    focused: { title: "focused", when: { year }, difficulty: 0 },
    timeline: [
      { title: "first", when: { year: 1900 }, difficulty: 0 },
      { title: "second", when: { year: 2000 }, difficulty: 0 },
    ],
  })

  test("before any (correct)", () => {
    expect(attemptToPlaceCard(atYear(1850), 0).focused).toBeUndefined()
  })
  test("before any (should be middle)", () => {
    expect(attemptToPlaceCard(atYear(1950), 0).focused).toBeDefined()
  })
  test("before any (should be after any)", () => {
    expect(attemptToPlaceCard(atYear(2050), 0).focused).toBeDefined()
  })

  test("middle (should be before any)", () => {
    expect(attemptToPlaceCard(atYear(1850), 1).focused).toBeDefined()
  })
  test("middle (correct)", () => {
    expect(attemptToPlaceCard(atYear(1950), 1).focused).toBeUndefined()
  })
  test("middle (should be after any)", () => {
    expect(attemptToPlaceCard(atYear(2050), 1).focused).toBeDefined()
  })

  test("after any (should be before any)", () => {
    expect(attemptToPlaceCard(atYear(1850), 2).focused).toBeDefined()
  })
  test("after any (should be middle)", () => {
    expect(attemptToPlaceCard(atYear(1950), 2).focused).toBeDefined()
  })
  test("after any (correct)", () => {
    expect(attemptToPlaceCard(atYear(2050), 2).focused).toBeUndefined()
  })
})
