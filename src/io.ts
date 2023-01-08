import { Event } from "./timeline.js"

export async function loadEvents(url: string): Promise<Event[]> {
  const response = await fetch(url)
  return (await response.json()) as Event[]
}
