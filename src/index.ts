import {
  createGame,
  render,
  attemptToPlaceCard,
  GameState,
} from "./timeline.js"
import { loadEvents } from "./io.js"

let deckUrls = ["public/decks/presidents.csv", "public/decks/test.csv"]
let game: GameState | undefined = undefined

const handler = (indexAfterLocation: number) => {
  if (!game) return
  try {
    game = attemptToPlaceCard(game, indexAfterLocation)
    render(game, handler)
  } catch (e: any) {
    alert(e.message)
  }
}

async function resetGame() {
  const decks = await Promise.all(deckUrls.map(loadEvents))
  const deck = decks.flat()
  console.log("starting game with deck", deck)
  game = createGame(deck)
  render(game, handler)
}

resetGame()
