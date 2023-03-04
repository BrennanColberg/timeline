import Game from "@/components/Game"
import Results from "@/components/Results"
import { loadConfigFromQuery } from "@/lib/io"
import { createGame, GameState } from "@/lib/timeline"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Play() {
  const router = useRouter()
  const [game, setGame] = useState<GameState>()
  useEffect(() => {
    if (router.query) {
      const config = loadConfigFromQuery(router.query)
      if (config) createGame(config).then(setGame)
    }
  }, [router.query])

  if (!game) return <></>
  if (!game.finished) return <Game game={game} setGame={setGame} />
  return (
    <Results
      game={game}
      playAgain={() => router.reload()}
      returnToMenu={() => router.push("/")}
    />
  )
}
