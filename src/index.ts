import { createGame, render, attemptToPlaceCard } from "./timeline.js"
import DEFAULT_DECK from "./DEFAULT_DECK.js"

console.log("hello world")

let game = createGame(DEFAULT_DECK)
const handler = (indexAfterLocation: number) => {
  try {
    game = attemptToPlaceCard(game, indexAfterLocation)
    render(game, handler)
  } catch (e: any) {
    alert(e.message)
  }
}
render(game, handler)
