import Game from "@/components/Game"
import Menu from "@/components/Menu"
import Results from "@/components/Results"
import { Event } from "@/lib/timeline"
import { useState, useCallback } from "react"

export default function Home() {
  const [mode, setMode] = useState<"menu" | "game" | "results">("menu")

  const startGame = useCallback((deck: Event[]) => {
    console.log("starting with deck", deck)
  }, [])

  if (mode === "menu") return <Menu {...{ startGame }} />
  if (mode === "game") return <Game />
  if (mode === "results") return <Results />
}
