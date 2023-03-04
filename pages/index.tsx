import Game from "@/components/Game"
import Menu from "@/components/Menu"
import Results from "@/components/Results"
import { createGame, GameState, GameConfig } from "@/lib/timeline"
import { useState, useCallback } from "react"

export default function Home() {
  const [game, setGame] = useState<GameState>()

  const startGame = useCallback(async (config: GameConfig) => {
    console.log("starting game", config)
    createGame(config).then(setGame)
  }, [])

  const playAgain = useCallback(() => {
    if (game) startGame(game.config)
  }, [game, startGame])

  const returnToMenu = useCallback(() => {
    setGame(undefined)
  }, [])

  if (game === undefined) return <Menu {...{ startGame }} />
  else if (!game.finished) return <Game {...{ game, setGame }} />
  else return <Results {...{ game, playAgain, returnToMenu }} />
}
