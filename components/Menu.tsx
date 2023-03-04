import { useCallback, useEffect, useState } from "react"
import { createGame, Difficulty, Event, GameState } from "@/lib/timeline"
import { loadEvents } from "@/lib/io"
import classNames from "classnames"
import * as Slider from "@radix-ui/react-slider"

const DECK_OPTIONS = {
  presidents: {
    name: "American Presidents",
  },
  scotus_decisions: {
    name: "SCOTUS Decisions",
  },
  elements: {
    name: "Element Discoveries",
  },
} as const

export default function Menu({
  startGame,
}: {
  startGame: (game: GameState) => void
}) {
  const [fullDecks, setFullDecks] = useState<Map<string, Event[]>>()
  useEffect(() => {
    setFullDecks(new Map())
    const newDecks = new Map<string, Event[]>()
    Promise.all(
      Object.keys(DECK_OPTIONS).map((deckId) =>
        loadEvents(`/decks/${deckId}.csv`).then((events) => {
          newDecks.set(deckId, events)
        }),
      ),
    ).then(() => setFullDecks(newDecks))
  }, [])

  const [deckDifficulties, setDeckDifficulties] =
    useState<Map<string, Set<Difficulty>>>()
  useEffect(() => {
    const newDeckDifficulties = new Map<string, Set<Difficulty>>()
    fullDecks?.forEach((events, deckId) => {
      const difficulties = new Set<Difficulty>()
      events.forEach((event) => difficulties.add(event.difficulty))
      newDeckDifficulties.set(deckId, difficulties)
    })
    setDeckDifficulties(newDeckDifficulties)
  }, [fullDecks])

  const [selectedDecks, setSelectedDecks] = useState<
    { deck: string; difficulty: Difficulty }[]
  >([])
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [failuresAllowed, setFailuresAllowed] = useState<number>(0)

  const isSelected = useCallback(
    (
      deck: string,
      difficulty: Difficulty,
      selections: typeof selectedDecks = selectedDecks,
    ) =>
      !!selections.find(
        (selection) =>
          selection.deck === deck && selection.difficulty === difficulty,
      ),
    [selectedDecks],
  )

  const select = useCallback(
    (deck: string, difficulty: Difficulty) => {
      setSelectedDecks((oldSelectedDecks) => {
        const wasSelected = isSelected(deck, difficulty, oldSelectedDecks)
        let newDeck = [...oldSelectedDecks]
        newDeck = newDeck.filter((selection) => selection.deck !== deck)
        if (!wasSelected) newDeck = [...newDeck, { deck, difficulty }]
        return newDeck
      })
    },
    [isSelected],
  )

  const [dateRange, setDateRange] = useState<[min: number, max: number]>()
  const [selectedDateRange, setSelectedDateRange] =
    useState<[min: number, max: number]>()
  useEffect(() => {
    let minYear = Infinity
    let maxYear = -Infinity
    selectedDecks.forEach(({ deck, difficulty }) => {
      fullDecks?.get(deck)?.forEach((event) => {
        if (event.difficulty <= difficulty) {
          minYear = Math.min(minYear, event.year)
          maxYear = Math.max(maxYear, event.year)
        }
      })
    })
    if (minYear !== Infinity) {
      setDateRange((oldLimits) => {
        setSelectedDateRange((oldRange) => {
          if (oldRange === undefined || oldLimits === undefined)
            return [minYear, maxYear]

          const newMin = Math.max(
            Math.min(
              oldRange[0] === oldLimits[0] ? minYear : oldRange[0],
              maxYear,
            ),
            minYear,
          )
          const newMax = Math.max(
            Math.min(
              oldRange[1] === oldLimits[1] ? maxYear : oldRange[1],
              maxYear,
            ),
            minYear,
          )
          return [newMin, newMax]
        })
        return [minYear, maxYear]
      })
    } else setDateRange(undefined)
  }, [selectedDecks, fullDecks])

  const start = useCallback(() => {
    const deck = selectedDecks
      .map(({ deck, difficulty }) =>
        fullDecks?.get(deck)?.filter((event) => event.difficulty <= difficulty),
      )
      .filter((deck): deck is Event[] => deck !== undefined)
      .flat()
      .filter(
        (event) =>
          !selectedDateRange ||
          (selectedDateRange[0] <= event.year &&
            event.year <= selectedDateRange[1]),
      )
    if (!deck.length) return alert("Select at least one deck to play!")
    startGame(createGame(deck, { hardMode, failuresAllowed }))
  }, [
    selectedDecks,
    startGame,
    hardMode,
    failuresAllowed,
    fullDecks,
    selectedDateRange,
  ])

  return (
    <form
      id="menu"
      className="flex flex-col items-center py-4"
      onSubmit={async (e) => {
        e.preventDefault()
        start()
      }}
    >
      <div className="mt-6 mb-10 flex flex-col gap-3">
        <h1 className="font-bold text-xl text-center">Welcome to Timeline!</h1>
        <p className="w-96">
          This is based on{" "}
          <a
            href="https://amzn.to/3YCbHPc"
            className="underline"
            target="_blank"
          >
            the card game of the same name.
          </a>
        </p>
        <p className="w-96">
          Your goal is to put historical events in their proper order. Each has
          a year, and you are to select the spot in the timeline where the event
          you are shown fits.
        </p>
        <p className="w-96">When you get a place wrong, you lose. Good luck!</p>
      </div>
      <div className="flex flex-col items-center mx-auto bg-gray-200 px-10 py-5 rounded-lg shadow-md gap-4">
        <table className="border-separate border-spacing-x-2 border-spacing-y-1">
          <thead>
            <tr>
              <th>Category</th>
              <th>Difficulty</th>
              {/* <th>Weight</th> */}
            </tr>
          </thead>
          <tbody>
            {Object.entries(DECK_OPTIONS).map(([deck, { name }]) => (
              <tr key={deck}>
                <td className="text-right">{name}</td>
                <td>
                  <button
                    type="button"
                    className={classNames(
                      "bg-green-300 px-1 py-0.25 rounded-sm border-2",
                      isSelected(deck, -1) && "border-black",
                      "disabled:opacity-0",
                    )}
                    onClick={() => select(deck, -1)}
                    disabled={!deckDifficulties?.get(deck)?.has(-1)}
                  >
                    Easy
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      "bg-yellow-300 px-1 py-0.25 rounded-sm border-2",
                      isSelected(deck, 0) && "border-black",
                      "disabled:opacity-0",
                    )}
                    onClick={() => select(deck, 0)}
                    disabled={!deckDifficulties?.get(deck)?.has(0)}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      "bg-red-300 px-1 py-0.25 rounded-sm border-2",
                      isSelected(deck, 1) && "border-black",
                      "disabled:opacity-0",
                    )}
                    onClick={() => select(deck, 1)}
                    disabled={!deckDifficulties?.get(deck)?.has(1)}
                  >
                    Hard
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <label className="font-semibold flex flex-row items-center">
          <input
            type="checkbox"
            className="inline-block mr-1"
            checked={hardMode}
            onChange={(e) => setHardMode(e.target.checked)}
          />{" "}
          Hard Mode (no dates shown)
        </label>

        <label className="font-semibold">
          <input
            type="number"
            className="w-10 mr-2 text-center font-normal"
            value={failuresAllowed}
            onChange={(e) => setFailuresAllowed(e.target.valueAsNumber)}
            step={1}
            min={0}
          />
          Failures Allowed
        </label>

        {dateRange && selectedDateRange && (
          <>
            <div className="flex flex-row items-center gap-2 text-gray-500">
              {dateRange[0]}
              <Slider.Root
                className="relative flex items-center select-none touch-none w-[200px] h-5"
                value={selectedDateRange}
                onValueChange={(value) =>
                  setSelectedDateRange([value[0], value[1]])
                }
                min={dateRange[0]}
                max={dateRange[1]}
                step={1}
                minStepsBetweenThumbs={1}
                // aria-label="Volume"
              >
                <Slider.Track className="bg-blackA10 relative grow rounded-full h-[3px]">
                  <Slider.Range className="absolute bg-white rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8" />
                <Slider.Thumb className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8" />
              </Slider.Root>
              {dateRange[1]}
            </div>
            <p className="-mt-4">
              from {selectedDateRange[0]} to {selectedDateRange[1]}
            </p>
          </>
        )}

        <button
          className="w-36 h-10 text-xl bg-green-400 hover:bg-green-500 rounded-md shadow-md mt-4 font-bold disabled:bg-gray-500 transition-colors duration-300 disabled:shadow-none"
          disabled={selectedDecks.length === 0}
        >
          Start Game
        </button>
      </div>
    </form>
  )
}
