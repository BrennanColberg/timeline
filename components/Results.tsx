import { GameState } from "@/lib/timeline"

export default function Results({
  game,
  playAgain,
}: {
  game: GameState
  playAgain: () => void
}) {
  return (
    <div className="flex w-screen flex-col items-center gap-4">
      <h1 className="text-3xl font-bold mt-8">Timeline Results</h1>
      <p>
        You got {game.deck.length === 0 ? "all " : ""}
        {game.timeline.length - 1} correct!
      </p>
      <button
        className="font-semibold text-xl px-4 py-2 bg-blue-300 hover:bg-blue-400 transition-colors duration-150 rounded-lg shadow-lg"
        onClick={() => playAgain()}
      >
        Play Again
      </button>
    </div>
  )
}
