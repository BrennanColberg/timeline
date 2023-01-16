import { Event } from "./timeline.js"

function csvToJson(csv: string): object[] {
  const lines = csv.split("\n")
  const headers = lines[0].split(",")
  return lines
    .slice(1)
    .map((line) =>
      line
        .split(",")
        .reduce<object>(
          (result, field, i) => ({ ...result, [headers[i]]: field }),
          {},
        ),
    )
}

export async function loadEvents(url: string): Promise<Event[]> {
  const response = await fetch(url)
  if (response.status !== 200) throw new Error("invalid deck url")
  const text = await response.text()
  console.log(text, csvToJson(text))
  return csvToJson(text) as Event[]
}
