import { createGame, render, attemptToPlaceCard } from "./timeline.js"
import { loadEvents } from "./io.js"

const url = "public/DEFAULT_DECK.json"
const deck = await loadEvents(url)
console.log(deck)

console.log("hello world")

let game = createGame(deck)
const handler = (indexAfterLocation: number) => {
  try {
    game = attemptToPlaceCard(game, indexAfterLocation)
    render(game, handler)
  } catch (e: any) {
    alert(e.message)
  }
}
render(game, handler)
