import { useCallback, useEffect, useState } from "react"
import { Difficulty, Event } from "@/lib/timeline"
import { loadEvents } from "@/lib/io"
import classNames from "classnames"

const DECK_OPTIONS = {
  presidents: {
    name: "American Presidents",
    color: "bg-purple-300",
  },
  elements: {
    name: "Element Discoveries",
    color: "bg-yellow-200",
  },
} as const

export default function Menu({
  startGame,
}: {
  startGame: (deck: Event[]) => void
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

  return (
    <form
      id="menu"
      className="flex flex-col items-center py-4"
      onSubmit={async (e) => {
        e.preventDefault()
        const allDecks = await Promise.all(
          selectedDecks.map(({ deck, difficulty }) =>
            loadEvents(`/decks/${deck}.csv`, difficulty),
          ),
        )
        const deck = allDecks.flat()
        if (!deck.length) return alert("Select at least one deck to play!")
        startGame(deck)
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
      <div className="flex flex-col items-center mx-auto bg-gray-200 px-10 py-5 rounded-lg shadow-md">
        <table className="border-separate border-spacing-x-2 border-spacing-y-1">
          <thead>
            <tr>
              <th>Category</th>
              <th>Difficulty</th>
              {/* <th>Weight</th> */}
            </tr>
          </thead>
          <tbody>
            {Object.entries(DECK_OPTIONS).map(([deck, { color, name }]) => (
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
                {/* <td className="font-mono text-center">
                  <button
                    type="button"
                    className="bg-white text-semibold rounded-full px-1 inline-block font-bold shadow-sm"
                  >
                    -
                  </button>
                  <span className="mx-1 font-semibold">1</span>
                  <button
                    type="button"
                    className="bg-white text-semibold rounded-full px-1 inline-block font-bold shadow-sm"
                  >
                    +
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

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
