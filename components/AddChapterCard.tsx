"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/AppContext"

export function AddChapterCard() {
  const { state, dispatch } = useApp()
  const [isAdding, setIsAdding] = useState(false)
  const [chapterName, setChapterName] = useState("")

  const handleAddChapter = () => {
    if (chapterName.trim()) {
      dispatch({
        type: "ADD_CHAPTER",
        payload: {
          subject: state.activeSubject,
          name: chapterName.trim(),
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

  if (isAdding) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <Input
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddChapter()
              if (e.key === "Escape") handleCancel()
            }}
            placeholder="Enter chapter name"
            className="flex-1"
            autoFocus
          />
          <Button onClick={handleAddChapter}>Add</Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
      onClick={() => setIsAdding(true)}
    >
      <div className="flex flex-col items-center justify-center text-gray-500 hover:text-blue-600">
        <Plus className="w-8 h-8 mb-2" />
        <span className="text-sm font-medium">Add New Chapter</span>
      </div>
    </div>
  )
}
