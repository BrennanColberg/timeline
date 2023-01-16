import {
  createGame,
  render,
  attemptToPlaceCard,
  GameState,
} from "./timeline.js"
import { loadEvents } from "./io.js"

let game: GameState | undefined = undefined

const menu = document.querySelector("#menu") as HTMLFormElement
menu.addEventListener("submit", start)
async function start(event: SubmitEvent) {
  event.preventDefault()

  // get selected decks
  const select = document.querySelector("#menu select") as HTMLSelectElement
  const deckURLs = [...select.selectedOptions].map((option) => option.value)
  // compose final deck from selected
  const decks = await Promise.all(deckURLs.map(loadEvents))
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
