export type Event = {
  year: number
  title: string
}

type GameState = {
  deck: Event[]
  focused: Event
  timeline: Event[]
}

function pickRandomCard(deck: Event[]): { event: Event; deck: Event[] } {
  if (deck.length <= 0) throw new Error("empty deck")
  const index = Math.floor(Math.random() * deck.length)
  return {
    event: deck[index],
    deck: [...deck.slice(0, index), ...deck.slice(index + 1)],
  }
}

export function createGame(deck: Event[]): GameState {
  const { deck: deck2, event: event1 } = pickRandomCard(deck)
  const { deck: deck3, event: event2 } = pickRandomCard(deck2)
  return { deck: deck3, focused: event1, timeline: [event2] }
}

export function attemptToPlaceCard(
  game: GameState,
  indexAfterLocation: number,
) {
  game = structuredClone(game)

  // 1. check if event is placed in the right location
  if (indexAfterLocation < 0 || indexAfterLocation > game.timeline.length + 1)
    throw new Error("index out of bounds")
  // before everything on the timeline
  if (indexAfterLocation === 0) {
    if (game.timeline[0].year < game.focused.year) throw new Error("too early")
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
  return game
}

export function render(game: GameState): void {
  // deck
  const deck = document.getElementById("deck")
  if (!deck) throw new Error("no deck in dom")
  deck.replaceChildren(
    ...game.deck
      .sort((a, b) => a.year - b.year)
      .map((event) => {
        const li = document.createElement("li")
        li.textContent = event.title
        return li
      }),
  )
  // focused
  const focused = document.getElementById("focused")
  if (!focused) throw new Error("no focused in dom")
  focused.textContent = game.focused.title
  // timeline
  const timeline = document.getElementById("timeline")
  if (!timeline) throw new Error("no timeline in dom")
  timeline.replaceChildren(
    ...game.timeline
      .sort((a, b) => a.year - b.year)
      .map((event) => {
        const li = document.createElement("li")
        li.textContent = `[${event.year}] ${event.title}`
        return li
      }),
  )
}
