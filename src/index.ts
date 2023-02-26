import {
  createGame,
  render,
  attemptToPlaceCard,
  GameState,
} from "../lib/timeline.js"
import { loadEvents, parseEventsFile } from "../lib/io.js"
import type { Event } from "../lib/timeline.js"

const MENU = document.getElementById("menu") as HTMLFormElement
const PLAY_AGAIN = document.getElementById("play-again") as HTMLButtonElement

let game: GameState | undefined = undefined

MENU.addEventListener("submit", start)
PLAY_AGAIN.addEventListener("click", start)
async function start(event: SubmitEvent | MouseEvent) {
  event.preventDefault()

  // get selected decks
  const formData = new FormData(MENU)
  console.log(formData.values())
  const deck: Event[] = []
  for (let [deckName, value] of formData) {
    if (value === "on") {
      const url = `public/decks/${deckName}.csv`
      const events = await loadEvents(url)
      deck.push(...events)
    }
  }
  if (deck.length === 0) {
    alert("Select at least one deck to continue!")
    return
  }
  console.log("starting game with deck", deck)

  // start game
  const handler = (indexAfterLocation: number) => {
    if (!game) return
    try {
      game = attemptToPlaceCard(game, indexAfterLocation)
      render(game, handler)
    } catch (e: any) {
      alert(e.message)
      end()
    }
  }
  game = createGame(deck)
  render(game, handler)

  // mark as started (hides menu, shows game)
  document.body.className = "game"
}

async function end() {
  if (!game) throw new Error("cannot end game that does not exist")

  // set fields
  const correctCards = game.timeline.length - 1
  document.getElementById("correct-cards")!.textContent = correctCards + ""
  const score = Math.floor(Math.pow(correctCards, 1.1) * 100)
  document.getElementById("score")!.textContent = score + ""

  // show results
  document.body.className = "results"
}
