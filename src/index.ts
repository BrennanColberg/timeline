import {
  createGame,
  render,
  attemptToPlaceCard,
  GameState,
} from "./timeline.js"
import { loadEvents, parseEventsFile } from "./io.js"

let game: GameState | undefined = undefined

document.getElementById("menu")!.addEventListener("submit", start)
async function start(event: SubmitEvent | MouseEvent) {
  event.preventDefault()

  // get selected decks
  const formData = new FormData(event.target as HTMLFormElement)
  const deckURLs = formData.getAll("select-decks") as string[]
  const decks = await Promise.all(deckURLs.map(loadEvents))

  const file = formData.get("upload-deck") as File
  if (file?.size > 0) {
    const fileDeck = await parseEventsFile(file)
    decks.push(fileDeck)
  }

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
