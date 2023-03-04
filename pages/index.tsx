import Game from "@/components/Game"
import Menu from "@/components/Menu"
import Results from "@/components/Results"
import { GameState } from "@/lib/timeline"
import { useState, useCallback } from "react"

export default function Home() {
  const [initialGame, setInitialGame] = useState<GameState>()
  const [game, setGame] = useState<GameState>()

  const startGame = useCallback((game: GameState) => {
    console.log("starting game", game)
    setInitialGame(game)
    setGame(game)
  }, [])

  const playAgain = useCallback(() => {
    setGame(initialGame)
  }, [initialGame])

  if (game === undefined) return <Menu {...{ startGame }} />
  else if (!game.finished) return <Game {...{ game, setGame }} />
  else return <Results {...{ game, playAgain }} />
}
