import Menu from "@/components/Menu"
import { generateURLFromConfig } from "@/lib/io"
import { GameConfig } from "@/lib/timeline"
import { useRouter } from "next/router"
import { useCallback } from "react"

export default function Home() {
  const router = useRouter()

  const startGame = useCallback(
    async (config: GameConfig) => {
      console.log("starting game", config)
      router.push(generateURLFromConfig(config))
    },
    [router],
  )

  return <Menu {...{ startGame }} />
}
