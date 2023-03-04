import { GameState, attemptToPlaceCard } from "@/lib/timeline"
import classNames from "classnames"
import { Dispatch, Fragment, SetStateAction } from "react"

export default function Game({
  game,
  setGame,
}: {
  game: GameState
  setGame: Dispatch<SetStateAction<GameState | undefined>>
}) {
  return (
    <div className="flex flex-col max-w-screen-sm max-h-screen m-auto">
      {game.focused && (
        <p
          className={classNames(
            "px-4 py-2 text-center font-semibold shadow-lg transition-colors duration-500 rounded-b-md",
            {
              "bg-green-200": game.focused.difficulty === -1,
              "bg-yellow-200": game.focused.difficulty === 0,
              "bg-red-200": game.focused.difficulty === 1,
            },
          )}
        >
          {game.focused.title}
        </p>
      )}

      <div className="overflow-y-scroll scrollbar-hide">
        <ul className="mx-4 my-8 border-l-8 border-gray-400">
          {[
            {
              year: -Infinity,
              title: "beginning of the universe",
              difficulty: undefined,
            },
            ...game.timeline,
            {
              year: new Date().getFullYear(),
              title: "now",
              difficulty: undefined,
            },
          ].map(({ title, year, difficulty }, i) => (
            <Fragment key={title}>
              {i !== 0 && (
                <button
                  className="text-sm px-2 py-0.5 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 rounded-lg shadow-md ml-4 my-1"
                  onClick={() => {
                    setGame((game) => attemptToPlaceCard(game!, i - 1))
                  }}
                >
                  ↕
                </button>
              )}
              <li
                key={title}
                className={classNames(
                  "flex flex-row flex-nowrap items-center",
                  {
                    "mt-1": i !== 0,
                    "mb-1": title !== "now",
                  },
                )}
              >
                <div
                  className={classNames(
                    "px-2 py-1 rounded-r-md mr-2 font-semibold",
                    {
                      "bg-gray-400": difficulty === undefined,
                      "bg-green-200": difficulty === -1,
                      "bg-yellow-200": difficulty === 0,
                      "bg-red-200": difficulty === 1,
                    },
                  )}
                >
                  {i !== 0 ? year : title}
                </div>
                {i !== 0 && <span>{title}</span>}
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  )
}
