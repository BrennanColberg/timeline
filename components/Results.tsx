import { GameState } from "@/lib/timeline"

export default function Results({
  game,
  playAgain,
  returnToMenu,
}: {
  game: GameState
  playAgain: () => void
  returnToMenu: () => void
}) {
  return (
    <div className="flex w-screen flex-col items-center gap-4">
      <h1 className="text-3xl font-bold mt-8">Timeline Results</h1>
      <p>
        You got {game.deck.length === 0 ? "all " : ""}
        {game.timeline.length - 1} correct!
      </p>

      <div className="flex flex-col gap-2 items-center">
        <button
          className="font-bold text-2xl px-4 py-2 bg-green-400 hover:bg-green-500 transition-colors duration-150 rounded-lg shadow-lg"
          onClick={() => playAgain()}
        >
          Play Again
        </button>
        <button
          className="font-medium text-md px-2 py-1.5 bg-gray-300 hover:bg-gray-400 transition-colors duration-150 rounded-lg shadow-lg"
          onClick={() => returnToMenu()}
        >
          Return To Menu
        </button>
      </div>
    </div>
  )
}
