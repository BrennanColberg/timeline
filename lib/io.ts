import { Difficulty, Event } from "./timeline"

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
