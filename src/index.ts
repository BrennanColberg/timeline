namespace Timeline {
  type Event = {
    year: number
    title: string
  }

  const deck: Event[] = [
    { year: 1776, title: "declaration of independence signed" },
    { year: 1939, title: "ww2 breaks out" },
    { year: 1903, title: "first powered flight" },
  ]

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

  function createGame(deck: Event[]): GameState {
    const { deck: deck2, event: event1 } = pickRandomCard(deck)
    const { deck: deck3, event: event2 } = pickRandomCard(deck2)
    return { deck: deck3, focused: event1, timeline: [event2] }
  }

  function attemptToPlaceCard(game: GameState, indexAfterLocation: number) {
    game = structuredClone(game)

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
    return game
  }

  function renderTimeline(events: Event[]): void {
    const ul = document.getElementById("timeline")
    if (!ul) throw new Error("no timeline in dom")
    // put in events
    ul.replaceChildren(
      ...events
        .sort((a, b) => a.year - b.year)
        .map((event) => {
          const li = document.createElement("li")
          li.textContent = `[${event.year}] ${event.title}`
          return li
        }),
    )
  }

  console.log("hello world")

  renderTimeline()
}
