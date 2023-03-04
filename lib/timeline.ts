import { loadEvents } from "./io"

export const AVAILABLE_DECKS = {
  presidents: "American Presidents",
  scotus_decisions: "SCOTUS Decisions",
  elements: "Element Discoveries",
} as const
export function isValidDeckId(
  deckId: string,
): deckId is keyof typeof AVAILABLE_DECKS {
  return deckId in AVAILABLE_DECKS
}

export enum Difficulty {
  Easy = -1,
  Normal = 0,
  Hard = 1,
}

export type Event = {
  year: number
  title: string
  difficulty: Difficulty
}

export type GameConfig = {
  decks: { deckId: keyof typeof AVAILABLE_DECKS; difficulty: Difficulty }[]
  minYear?: number
  maxYear?: number
  mistakesAllowed: number
  blindMode: boolean
}
export type GameState = {
  config: GameConfig
  deck: Event[]
  focused?: Event
  timeline: Event[]
  finished: boolean
  mistakesRemaining: number
}

let allDecksCache: Map<string, Event[]>
export async function getAllDecks(): Promise<Map<string, Event[]>> {
  if (!allDecksCache) {
    allDecksCache = new Map()
    await Promise.all(
      Object.keys(AVAILABLE_DECKS).map((deckId) =>
        loadEvents(deckId).then((events) => {
          allDecksCache.set(deckId, events)
        }),
      ),
    )
  }
  return allDecksCache
}

function pickRandomCard(deck: Event[]): { event?: Event; deck: Event[] } {
  if (deck.length <= 0) return { event: undefined, deck: [] }
  const index = Math.floor(Math.random() * deck.length)
  return {
    event: deck[index],
    deck: [...deck.slice(0, index), ...deck.slice(index + 1)],
  }
}

export async function createGame(config: GameConfig): Promise<GameState> {
  const allDecks = await getAllDecks()
  const deck = config.decks.flatMap(({ deckId, difficulty }) =>
    allDecks.get(deckId)!.filter((event) => {
      const difficultyCheck = event.difficulty <= difficulty
      const minYearCheck = !config.minYear || config.minYear <= event.year
      const maxYearCheck = !config.maxYear || event.year <= config.maxYear
      return difficultyCheck && minYearCheck && maxYearCheck
    }),
  )
  if (deck.length < 2) throw new Error("deck not big enough")
  const { deck: deck2, event: event1 } = pickRandomCard(deck)
  const { deck: deck3, event: event2 } = pickRandomCard(deck2)
  return {
    config,
    deck: deck3,
    focused: event1!,
    timeline: [event2!],
    finished: false,
    mistakesRemaining: config.mistakesAllowed,
  }
}

export function attemptToPlaceCard(
  game: GameState,
  indexAfterLocation: number,
) {
  if (game.finished) throw new Error("no placing cards in finished game!")
  game = structuredClone(game)
  if (!game.focused) return game
  try {
    // 1. check if event is placed in the right location
    if (indexAfterLocation < 0 || indexAfterLocation > game.timeline.length + 1)
      throw new Error("index out of bounds")
    // before everything on the timeline
    if (indexAfterLocation === 0) {
      if (game.timeline[0].year < game.focused.year)
        throw new Error("too early")
    }
    // after everything on the timeline
    else if (indexAfterLocation === game.timeline.length) {
      if (game.timeline[game.timeline.length - 1].year > game.focused.year)
        throw new Error("too late")
    }
    // in the middle of the timeline
    else {
      if (!(game.timeline[indexAfterLocation - 1].year <= game.focused.year))
        throw new Error("event placed too late")
      if (!(game.focused.year <= game.timeline[indexAfterLocation].year))
        throw new Error("event placed too early")
    }

    // 2. actually place the event in the timeline
    game.timeline = [
      ...game.timeline.slice(0, indexAfterLocation),
      game.focused,
      ...game.timeline.slice(indexAfterLocation),
    ]

    // 3. focus on a new card, repeat
    const { deck: newDeck, event: newFocused } = pickRandomCard(game.deck)
    game.deck = newDeck
    game.focused = newFocused
    if (game.focused === undefined) game.finished = true
    return game
  } catch (error) {
    if (game.mistakesRemaining > 0) game.mistakesRemaining--
    else game.finished = true
    return game
  }
}
