"use client"

import { Moon, Sun } from "lucide-react"
import { useApp } from "@/contexts/AppContext"

export function DarkModeToggle() {
  const { state, dispatch } = useApp()

  const toggleDarkMode = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" })
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg bg-background hover:bg-accent transition-colors duration-200 border border-border"
      title={state.isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {state.isDarkMode ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
    </button>
  )
}
