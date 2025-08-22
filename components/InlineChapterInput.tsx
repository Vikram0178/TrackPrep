"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Check, X } from "lucide-react"
import { useApp } from "@/contexts/AppContext"

export function InlineChapterInput({ subject }: { subject: string }) {
  const { dispatch } = useApp()
  const [isAdding, setIsAdding] = useState(false)
  const [chapterName, setChapterName] = useState("")

  const handleStartAdding = () => {
    setIsAdding(true)
    setChapterName("")
  }

  const handleSave = () => {
    if (chapterName.trim()) {
      dispatch({
        type: "ADD_CHAPTER",
        payload: {
          name: chapterName.trim(),
          difficulty: "none",
          subject: subject,
        },
      })
      setChapterName("")
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setChapterName("")
    setIsAdding(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  if (isAdding) {
    return (
      <div className="bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter chapter name..."
            className="flex-1 text-lg font-medium text-slate-800 dark:text-slate-200 bg-transparent border-none outline-none placeholder-slate-400 dark:placeholder-slate-500"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-all duration-200"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleStartAdding}
      className="w-full bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-slate-500 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all duration-200 flex items-center gap-3"
    >
      <Plus className="w-5 h-5" />
      <span className="text-lg font-medium">Add Chapter</span>
    </button>
  )
}
