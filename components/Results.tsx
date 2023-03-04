import { AVAILABLE_DECKS, GameState } from "@/lib/timeline"
import classNames from "classnames"

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

      <div className="bg-gray-100 rounded-md p-2 flex flex-col gap-1">
        {game.config.decks.map(({ deckId, difficulty }) => (
          <div
            key={deckId}
            className={classNames(
              "px-2 py-1 rounded-md text-center font-semibold",
              {
                "bg-green-200": difficulty === -1,
                "bg-yellow-200": difficulty === 0,
                "bg-red-200": difficulty === 1,
              },
            )}
          >
            {AVAILABLE_DECKS[deckId]}
          </div>
        ))}
        <p className="font-normal text-center text-sm mt-1">
          Blind Mode:{" "}
          <span className="font-mono font-bold">
            {game.config.blindMode ? "ON" : "OFF"}
          </span>
        </p>
        <p className="font-normal text-center text-sm">
          Mistakes Allowed:{" "}
          <span className="font-mono font-bold">
            {game.config.mistakesAllowed}
          </span>
        </p>
        <p className="font-normal text-center text-sm">
          Years:{" "}
          <span className="font-mono font-bold">
            {game.config.minYear === undefined &&
            game.config.maxYear === undefined
              ? "ALL"
              : game.config.maxYear === undefined
              ? `${game.config.minYear} → NOW`
              : game.config.minYear === undefined
              ? `PRE-${game.config.maxYear + 1}`
              : `${game.config.minYear} → ${game.config.maxYear}`}
          </span>
        </p>
      </div>

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
