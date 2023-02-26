import { GameState, attemptToPlaceCard } from "@/lib/timeline"
import classNames from "classnames"
import { Dispatch, SetStateAction } from "react"

export default function Game({
  game,
  setGame,
}: {
  game: GameState
  setGame: Dispatch<SetStateAction<GameState | undefined>>
}) {
  return (
    <div className="flex flex-col w-screen max-h-screen">
      {game.focused && (
        <p className="bg-red-200 px-4 py-2 text-center font-semibold shadow-lg">
          {game.focused.title}
        </p>
      )}

      <ul className="overflow-y-scroll py-4">
        {[
          { year: -Infinity, title: "beginning of the universe" },
          ...game.timeline,
          { year: new Date().getFullYear(), title: "now" },
        ].map(({ title, year }, i) => (
          <>
            {i !== 0 && (
              <button
                className="text-sm px-2 py-0.5 bg-yellow-200 hover:bg-yellow-300 transition-colors duration-150 rounded-lg shadow-md ml-4 my-1"
                onClick={() => {
                  setGame((game) => attemptToPlaceCard(game!, i - 1))
                }}
              >
                ↕
              </button>
            )}
            <li
              key={title}
              className="my-1 flex flex-row flex-nowrap items-center"
            >
              <div
                className={classNames(
                  "px-2 py-1 rounded-r-md mr-2 font-semibold",
                  i === 0 || title === "now" ? "bg-gray-400" : "bg-gray-300",
                )}
              >
                {i !== 0 ? year : title}
              </div>
              {i !== 0 && <span>{title}</span>}
            </li>
          </>
        ))}
      </ul>
    </div>
  )
}
