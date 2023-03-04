import { useCallback, useEffect, useState } from "react"
import { createGame, Difficulty, Event, GameState } from "@/lib/timeline"
import { loadEvents } from "@/lib/io"
import classNames from "classnames"

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
  const [deckDifficulties, setDeckDifficulties] = useState<{
    [key: string]: Set<Difficulty>
  }>()

  useEffect(() => {
    Promise.all(
      Object.keys(DECK_OPTIONS).map((deck) =>
        loadEvents(`/decks/${deck}.csv`).then((events) => {
          const difficulties = new Set<Difficulty>()
          events.forEach((event) => difficulties.add(event.difficulty))
          return { deck, difficulties }
        }),
      ),
    ).then((difficultySets) => {
      const newDeckDifficulties: typeof deckDifficulties = {}
      difficultySets.forEach(({ deck, difficulties }) => {
        newDeckDifficulties[deck] = difficulties
      })
      setDeckDifficulties(newDeckDifficulties)
    })
  }, [])

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

  const start = useCallback(async () => {
    const allDecks = await Promise.all(
      selectedDecks.map(({ deck, difficulty }) =>
        loadEvents(`/decks/${deck}.csv`, difficulty),
      ),
    )
    const deck = allDecks.flat()
    if (!deck.length) return alert("Select at least one deck to play!")
    startGame(createGame(deck, { hardMode, failuresAllowed }))
  }, [selectedDecks, startGame, hardMode, failuresAllowed])

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
                    disabled={!deckDifficulties?.[deck].has(-1)}
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
                    disabled={!deckDifficulties?.[deck].has(0)}
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
                    disabled={!deckDifficulties?.[deck].has(1)}
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
