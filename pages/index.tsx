import Game from "@/components/Game"
import Menu from "@/components/Menu"
import Results from "@/components/Results"
import { useState } from "react"

export default function Home() {
  const [mode, setMode] = useState<"menu" | "game" | "results">("menu")
  if (mode === "menu") return <Menu />
  if (mode === "game") return <Game />
  if (mode === "results") return <Results />
}
