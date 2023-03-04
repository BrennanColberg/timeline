import { Difficulty, Event, GameConfig, isValidDeckId } from "./timeline"

function csvToJson(csv: string): object[] {
  const lines = csv.split("\n")
  const headers = lines[0].split(",")
  return lines.slice(1).map((line) =>
    line
      .split(",")
      .map((field) =>
        field.startsWith('"') && field.endsWith('"')
          ? field.slice(1, -1)
          : field,
      )
      .reduce<object>(
        (result, field, i) => ({ ...result, [headers[i]]: field }),
        {},
      ),
  )
}

export async function loadEvents(
  url: string,
  maxDifficulty: Difficulty = Difficulty.Hard,
): Promise<Event[]> {
  const response = await fetch(url)
  if (response.status !== 200) throw new Error("invalid deck url")
  const text = await response.text()
  const rawEvents = csvToJson(text) as {
    year: string
    title: string
    difficulty?: string
  }[]
  console.log(1, rawEvents)
  let events: Event[] = rawEvents.map((event) => ({
    title: event.title,
    year: parseInt(event.year),
    difficulty: parseInt(event.difficulty ?? "0") as Difficulty,
  }))
  console.log(2, events)
  console.log(maxDifficulty)
  events = events.filter((event) => event.difficulty <= maxDifficulty)
  console.log(3, events)
  console.log(`loaded ${events.length} events from ${response.url}`)
  return events
}

export async function parseEventsFile(file: File): Promise<Event[]> {
  const text = await file.text()
  const events = csvToJson(text) as Event[]
  console.log(`loaded ${events.length} events from file ${file.name}`)
  return events
}

export function loadConfigFromQuery({
  deck,
  blindMode,
  mistakesAllowed,
  from,
  to,
}: {
  [key: string]: string | string[] | undefined
}) {
  const config: GameConfig = {
    decks: [],
    blindMode: false,
    mistakesAllowed: 0,
    minYear: undefined,
    maxYear: undefined,
  }

  // load selectedDecks
  if (deck) {
    const decks = typeof deck === "string" ? [deck] : deck
    decks.forEach((deck) => {
      const parts = deck.split("-")
      const deckId = parts[0]
      const difficulty = ["easy", "e"].includes(parts[1])
        ? Difficulty.Easy
        : ["normal", "n", "medium", "m"].includes(parts[1])
        ? Difficulty.Normal
        : ["hard", "h"].includes(parts[1])
        ? Difficulty.Hard
        : Difficulty.Normal // default
      if (isValidDeckId(deckId)) config.decks.push({ difficulty, deckId })
    })
  }

  // load blindMode
  if (blindMode && typeof blindMode === "string")
    config.blindMode = ["true", "on", "1"].includes(blindMode)

  // load mistakesAllowed
  if (mistakesAllowed && typeof mistakesAllowed === "string") {
    const newMistakesAllowed = parseInt(mistakesAllowed)
    if (Number.isFinite(newMistakesAllowed) && newMistakesAllowed >= 0)
      config.mistakesAllowed = newMistakesAllowed
  }

  // load selectedDateRange
  if (from && typeof from === "string" && Number.isFinite(parseInt(from)))
    config.minYear = parseInt(from)
  if (to && typeof to === "string" && Number.isFinite(parseInt(to)))
    config.maxYear = parseInt(to)

  return config
}
