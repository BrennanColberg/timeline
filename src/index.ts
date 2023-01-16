import {
  createGame,
  render,
  attemptToPlaceCard,
  GameState,
} from "./timeline.js"
import { loadEvents } from "./io.js"

let deckUrls = ["public/decks/presidents.csv", "public/decks/test.csv"]
let game: GameState | undefined = undefined

const button = document.querySelector("#menu button") as HTMLButtonElement
button.addEventListener("click", start)
async function start() {
  // select + compose deck
  const decks = await Promise.all(deckUrls.map(loadEvents))
  const deck = decks.flat()
  console.log("starting game with deck", deck)

  // start game
  const handler = (indexAfterLocation: number) => {
    if (!game) return
    try {
      game = attemptToPlaceCard(game, indexAfterLocation)
      render(game, handler)
    } catch (e: any) {
      alert(e.message)
    }
  }
  game = createGame(deck)
  render(game, handler)

  // mark as started (hides menu, shows game)
  const body = document.querySelector("body")
  body?.classList.add("started")
}
