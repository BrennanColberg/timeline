import { useState } from "react"
import { Event } from "@/lib/timeline"
import { loadEvents } from "@/lib/io"
import classNames from "classnames"

const DECK_OPTIONS = {
  presidents: { name: "American Presidents", color: "bg-purple-300" },
  elements: { name: "Element Discoveries", color: "bg-yellow-200" },
} as const

export default function Menu({
  startGame,
}: {
  startGame: (deck: Event[]) => void
}) {
  const [selectedDecks, setSelectedDecks] = useState<string[]>([])
  return (
    <form
      id="menu"
      className="flex flex-col items-center py-4"
      onSubmit={async (e) => {
        e.preventDefault()
        const allDecks = await Promise.all(
          selectedDecks.map((deck) => loadEvents(`/decks/${deck}.csv`)),
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
        <h2 className="font-bold mb-2">Select Events:</h2>
        <div className="flex flex-col items-stretch gap-1">
          {Object.entries(DECK_OPTIONS).map(([deck, { color, name }]) => (
            <label
              className={classNames(
                "px-2 py-1 select-none cursor-pointer rounded-md hover:shadow-sm",
                color,
              )}
              key={deck}
            >
              <input
                type="checkbox"
                name={deck}
                checked={selectedDecks.includes(deck)}
                onChange={(e) => {
                  const checked = e.target.checked
                  if (checked && !selectedDecks.includes(deck))
                    setSelectedDecks((x) => [...x, deck])
                  if (!checked && selectedDecks.includes(deck))
                    setSelectedDecks((x) => {
                      const index = x.indexOf(deck)
                      if (index === -1) return x
                      return [...x.slice(0, index), ...x.slice(index + 1)]
                    })
                }}
              />{" "}
              {name}
            </label>
          ))}
        </div>

        <button className="w-36 h-10 text-xl bg-green-400 hover:bg-green-300 rounded-md hover:shadow-sm shadow-md mt-4 font-bold">
          Start Game
        </button>
      </div>
    </form>
  )
}
