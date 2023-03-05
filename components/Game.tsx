import { GameState, attemptToPlaceCard } from "@/lib/timeline"
import { whensEqual, whenToString } from "@/lib/when"
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
    <div className="flex flex-col max-w-screen-sm max-h-screen m-auto relative">
      {game.focused && (
        <p
          className={classNames(
            "px-4 py-2 text-center font-semibold shadow-lg transition-colors duration-500 rounded-b-md z-10",
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
      <p className="text-center text-sm bg-gray-100 border-2 border-t-0 px-1 py-0.5 border-gray-300 ml-auto mr-3 -mb-4 rounded-b-lg text-gray-500 absolute right-0 top-10">
        {game.mistakesRemaining + 1} more strike
        {game.mistakesRemaining !== 0 ? "s" : ""} and <i>you&apos;re out!</i>
      </p>

      <div className="overflow-y-scroll scrollbar-hide">
        <ul className="mx-4 my-8 border-l-8 border-gray-400">
          {[
            {
              when: { year: -Infinity },
              title: "beginning of the universe",
              difficulty: undefined,
            },
            ...game.timeline,
            {
              when: {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
              },
              title: "now",
              difficulty: undefined,
            },
          ].map(({ title, when, difficulty }, i, array) => (
            <Fragment key={title}>
              {i !== 0 && !whensEqual(array[i - 1].when, when) && (
                <button
                  className="text-sm px-2 py-0.5 bg-gray-200 hover:bg-gray-300 transition-colors duration-150 rounded-lg shadow-md ml-4 my-1"
                  onClick={() => {
                    const newGame = attemptToPlaceCard(game!, i - 1)
                    if (newGame.mistakesRemaining < game.mistakesRemaining)
                      alert(
                        `Nope! The correct year is ${
                          game.focused!.when.year
                        }.\n\nYou now have ${
                          newGame.mistakesRemaining + 1
                        } strike${
                          newGame.mistakesRemaining === 0 ? "" : "s"
                        } left.`,
                      )
                    setGame(newGame)
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
                  {i !== 0
                    ? game.config.blindMode && title !== "now"
                      ? "????"
                      : whenToString(when)
                    : title}
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
