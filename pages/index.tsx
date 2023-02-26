import Game from "@/components/Game"
import Menu from "@/components/Menu"
import Results from "@/components/Results"
import { createGame, Event, GameState } from "@/lib/timeline"
import { useState, useCallback } from "react"

export default function Home() {
  const [game, setGame] = useState<GameState>()

  const startGame = useCallback((deck: Event[]) => {
    console.log("starting with deck", deck)
    setGame(createGame(deck))
  }, [])

  const playAgain = useCallback(() => {
    setGame((game) => {
      if (!game) return undefined
      else return createGame([...game.deck, ...game.timeline])
    })
  }, [])

  if (game === undefined) return <Menu {...{ startGame }} />
  else if (!game.finished) return <Game {...{ game, setGame }} />
  else return <Results {...{ game, playAgain }} />
}
