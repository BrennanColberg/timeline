import { useCallback, useEffect, useState } from "react"
import {
  AVAILABLE_DECKS,
  Difficulty,
  GameConfig,
  getAllDecks,
  isValidDeckId,
} from "@/lib/timeline"
import classNames from "classnames"
import * as Slider from "@radix-ui/react-slider"
import { useRouter } from "next/router"
import { loadConfigFromQuery } from "@/lib/io"

export default function Menu({
  startGame,
}: {
  startGame: (config: GameConfig) => void
}) {
  const [deckDifficulties, setDeckDifficulties] =
    useState<Map<string, Set<Difficulty>>>()
  useEffect(() => {
    getAllDecks().then((decks) => {
      const newDeckDifficulties = new Map<string, Set<Difficulty>>()
      decks?.forEach((events, deckId) => {
        const difficulties = new Set<Difficulty>()
        events.forEach((event) => difficulties.add(event.difficulty))
        newDeckDifficulties.set(deckId, difficulties)
      })
      setDeckDifficulties(newDeckDifficulties)
    })
  }, [])

  const [selectedDecks, setSelectedDecks] = useState<GameConfig["decks"]>([])
  const [blindMode, setBlindMode] = useState<boolean>(false)
  const [mistakesAllowed, setMistakesAllowed] = useState<number>(0)

  const isSelected = useCallback(
    (
      deck: string,
      difficulty: Difficulty,
      selections: typeof selectedDecks = selectedDecks,
    ) =>
      !!selections.find(
        (selection) =>
          selection.deckId === deck && selection.difficulty === difficulty,
      ),
    [selectedDecks],
  )

  const select = useCallback(
    (deck: keyof typeof AVAILABLE_DECKS, difficulty: Difficulty) => {
      setSelectedDecks((oldSelectedDecks) => {
        const wasSelected = isSelected(deck, difficulty, oldSelectedDecks)
        let newDeck = [...oldSelectedDecks]
        newDeck = newDeck.filter((selection) => selection.deckId !== deck)
        if (!wasSelected) newDeck = [...newDeck, { deckId: deck, difficulty }]
        return newDeck
      })
    },
    [isSelected],
  )

  const [dateRange, setDateRange] = useState<[min: number, max: number]>()
  const [selectedDateRange, setSelectedDateRange] = useState<
    [min?: number, max?: number]
  >([undefined, undefined])
  useEffect(() => {
    getAllDecks().then((decks) => {
      let minYear = Infinity
      let maxYear = -Infinity
      selectedDecks.forEach(({ deckId: deck, difficulty }) => {
        decks.get(deck)?.forEach((event) => {
          if (event.difficulty <= difficulty) {
            minYear = Math.min(minYear, event.year)
            maxYear = Math.max(maxYear, event.year)
          }
        })
      })
      if (minYear !== Infinity) {
        setDateRange([minYear, maxYear])
        setSelectedDateRange(([oldMin, oldMax]) => [
          oldMin === undefined || minYear > oldMin ? undefined : oldMin,
          oldMax === undefined || maxYear < oldMax ? undefined : oldMax,
        ])
      } else setDateRange(undefined)
    })
  }, [selectedDecks])

  const router = useRouter()
  useEffect(() => {
    const config = loadConfigFromQuery(router.query)
    setSelectedDecks(config.decks)
    setBlindMode(config.blindMode)
    setMistakesAllowed(config.mistakesAllowed)
    setSelectedDateRange([config.minYear, config.maxYear])
  }, [router.query])

  const start = useCallback(() => {
    if (!selectedDecks.length) return alert("Select at least one deck to play!")
    startGame({
      decks: selectedDecks,
      blindMode: blindMode,
      mistakesAllowed,
      minYear: selectedDateRange[0],
      maxYear: selectedDateRange[1],
    })
  }, [selectedDecks, startGame, blindMode, mistakesAllowed, selectedDateRange])

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
            {(
              Object.keys(AVAILABLE_DECKS) as (keyof typeof AVAILABLE_DECKS)[]
            ).map((deckId) => (
              <tr key={deckId}>
                <td className="text-right">{AVAILABLE_DECKS[deckId]}</td>
                <td>
                  <button
                    type="button"
                    className={classNames(
                      "bg-green-300 px-1 py-0.25 rounded-sm border-2",
                      isSelected(deckId, -1) && "border-black",
                      "disabled:opacity-0",
                    )}
                    onClick={() => select(deckId, -1)}
                    disabled={!deckDifficulties?.get(deckId)?.has(-1)}
                  >
                    Easy
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      "bg-yellow-300 px-1 py-0.25 rounded-sm border-2",
                      isSelected(deckId, 0) && "border-black",
                      "disabled:opacity-0",
                    )}
                    onClick={() => select(deckId, 0)}
                    disabled={!deckDifficulties?.get(deckId)?.has(0)}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      "bg-red-300 px-1 py-0.25 rounded-sm border-2",
                      isSelected(deckId, 1) && "border-black",
                      "disabled:opacity-0",
                    )}
                    onClick={() => select(deckId, 1)}
                    disabled={!deckDifficulties?.get(deckId)?.has(1)}
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
            checked={blindMode}
            onChange={(e) => setBlindMode(e.target.checked)}
          />{" "}
          Blind Mode (no dates shown)
        </label>

        <label className="font-semibold">
          <input
            type="number"
            className="w-10 mr-2 text-center font-normal"
            value={mistakesAllowed}
            onChange={(e) => setMistakesAllowed(e.target.valueAsNumber)}
            step={1}
            min={0}
          />
          Mistakes Allowed
        </label>

        {dateRange && (
          <>
            <div className="flex flex-row items-center gap-2 text-gray-500">
              {dateRange[0]}
              <Slider.Root
                className="relative flex items-center select-none touch-none w-[200px] h-5"
                value={[
                  selectedDateRange[0] ?? dateRange[0],
                  selectedDateRange[1] ?? dateRange[1],
                ]}
                onValueChange={(value) => {
                  setSelectedDateRange([
                    value[0] !== dateRange[0] ? value[0] : undefined,
                    value[1] !== dateRange[1] ? value[1] : undefined,
                  ])
                }}
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
              from {selectedDateRange[0] ?? dateRange[0]} to{" "}
              {selectedDateRange[1] ?? dateRange[1]}
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
