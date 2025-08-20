"use client"

import { useState } from "react"
import { ChevronDown, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useApp } from "@/contexts/AppContext"
import { calculateChapterProgress } from "@/utils/calculations"
import type { Chapter } from "@/types"
import { BookIcon, FileTextIcon, ClipboardIcon } from "@/components/ui/icons"
import { ConfirmDialog } from "@/components/ConfirmDialog"

interface ChapterCardProps {
  chapter: Chapter
}

const difficultyColors = {
  easy: "border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100",
  medium: "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100",
  hard: "border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100",
  none: "border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100",
}

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  none: "None",
}

const getProgressBarColor = (progress: number): string => {
  if (progress === 0) return "from-slate-300 to-slate-400"
  if (progress < 25) return "from-red-400 to-red-500"
  if (progress < 50) return "from-orange-400 to-orange-500"
  if (progress < 75) return "from-amber-400 to-amber-500"
  if (progress < 100) return "from-lime-400 to-lime-500"
  return "from-emerald-400 to-emerald-600"
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  const { dispatch } = useApp()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState(chapter.name)
  const [newActivityName, setNewActivityName] = useState("")
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [editingActivityName, setEditingActivityName] = useState("")
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const progress = calculateChapterProgress(chapter.activities)

  const allActivitiesCompleted =
    chapter.activities.length > 0 && chapter.activities.every((activity) => activity.completed)
  const someActivitiesCompleted = chapter.activities.some((activity) => activity.completed)

  const handleToggleAllActivities = () => {
    const shouldComplete = !allActivitiesCompleted
    dispatch({
      type: "TOGGLE_ALL_ACTIVITIES",
      payload: { chapterId: chapter.id, completed: shouldComplete },
    })
  }

  const getDaysLeft = () => {
    if (!chapter.targetDate) return null
    const today = new Date()
    const target = new Date(chapter.targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleTargetDateChange = (date: string) => {
    dispatch({ type: "SET_CHAPTER_TARGET_DATE", payload: { chapterId: chapter.id, targetDate: date } })
    const targetDate = new Date(date)
    const notificationDate = new Date(targetDate.getTime() - 24 * 60 * 60 * 1000)
    if (notificationDate > new Date()) {
      console.log(`[v0] Notification scheduled: Complete ${chapter.name} before ${targetDate.toLocaleDateString()}`)
    }
  }

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard" | "none") => {
    dispatch({ type: "SET_CHAPTER_DIFFICULTY", payload: { chapterId: chapter.id, difficulty } })
    setShowDifficultyDropdown(false)
  }

  const handleNameSave = () => {
    if (editName.trim() && editName !== chapter.name) {
      dispatch({ type: "RENAME_CHAPTER", payload: { chapterId: chapter.id, newName: editName.trim() } })
    }
    setIsEditingName(false)
  }

  const handleNameCancel = () => {
    setEditName(chapter.name)
    setIsEditingName(false)
  }

  const handleAddActivity = () => {
    if (newActivityName.trim()) {
      dispatch({ type: "ADD_ACTIVITY", payload: { chapterId: chapter.id, name: newActivityName.trim() } })
      setNewActivityName("")
      setIsAddingActivity(false)
    }
  }

  const handleDeleteChapter = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    dispatch({ type: "DELETE_CHAPTER", payload: { chapterId: chapter.id } })
    setShowDeleteConfirm(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const handleToggleActivity = (activityId: string) => {
    dispatch({ type: "TOGGLE_ACTIVITY", payload: { chapterId: chapter.id, activityId } })
  }

  const handleDeleteActivity = (activityId: string) => {
    dispatch({ type: "DELETE_ACTIVITY", payload: { chapterId: chapter.id, activityId } })
  }

  const handleActivityNameClick = (activityId: string, currentName: string) => {
    setEditingActivityId(activityId)
    setEditingActivityName(currentName)
  }

  const handleActivityNameSave = () => {
    if (editingActivityName.trim() && editingActivityId) {
      dispatch({
        type: "RENAME_ACTIVITY",
        payload: {
          chapterId: chapter.id,
          activityId: editingActivityId,
          newName: editingActivityName.trim(),
        },
      })
    }
    setEditingActivityId(null)
    setEditingActivityName("")
  }

  const handleActivityNameCancel = () => {
    setEditingActivityId(null)
    setEditingActivityName("")
  }

  const getActivityIcon = (activityName: string) => {
    const name = activityName.toLowerCase()
    if (name.includes("note")) return <FileTextIcon className="w-3 h-3" />
    if (name.includes("dpp")) return <ClipboardIcon className="w-3 h-3" />
    if (name.includes("module")) return <BookIcon className="w-3 h-3" />
    return <BookIcon className="w-3 h-3" />
  }

  return (
    <>
      <div
        className={`bg-white border-2 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 ${difficultyColors[chapter.difficulty || "medium"]}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={allActivitiesCompleted}
              ref={
                someActivitiesCompleted && !allActivitiesCompleted
                  ? (el) => {
                      if (el) el.indeterminate = true
                    }
                  : undefined
              }
              onCheckedChange={handleToggleAllActivities}
              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-all duration-200 scale-110"
              disabled={chapter.activities.length === 0}
            />

            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNameSave()
                    if (e.key === "Escape") handleNameCancel()
                  }}
                  className="text-lg font-medium focus:ring-2 focus:ring-emerald-200 border-slate-300 transition-all duration-200"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleNameSave}
                  className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNameCancel}
                  className="border-slate-300 hover:bg-slate-50 bg-transparent transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <h3
                className="text-lg font-semibold text-slate-800 cursor-pointer hover:text-emerald-600 transition-all duration-200 hover:scale-105"
                onClick={() => setIsEditingName(true)}
              >
                {chapter.name}
              </h3>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-100 transition-all duration-200 hover:scale-105 shadow-sm"
                onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
              >
                <span className="text-sm text-slate-700 font-medium">
                  {difficultyLabels[chapter.difficulty || "medium"]}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>

              {showDifficultyDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-10 animate-in slide-in-from-top-2 duration-200">
                  {(["none", "easy", "medium", "hard"] as const).map((difficulty) => (
                    <button
                      key={difficulty}
                      className="block w-full text-left px-4 py-3 text-sm hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl transition-all duration-200 font-medium"
                      onClick={() => handleDifficultyChange(difficulty)}
                    >
                      {difficultyLabels[difficulty]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <X
              className="w-4 h-4 text-slate-400 cursor-pointer hover:text-rose-500 transition-all duration-200 hover:scale-110"
              onClick={handleDeleteChapter}
            />
          </div>
        </div>

        {/* Activities */}
        <div className="flex items-center gap-6 mb-5 flex-wrap">
          {chapter.activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-2 group">
              <Checkbox
                id={activity.id}
                checked={activity.completed}
                onCheckedChange={() => handleToggleActivity(activity.id)}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-all duration-200"
              />
              <div className="flex items-center gap-1">
                <span
                  className={`transition-colors duration-200 ${activity.completed ? "text-emerald-600" : "text-slate-500"}`}
                >
                  {getActivityIcon(activity.name)}
                </span>
                {editingActivityId === activity.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editingActivityName}
                      onChange={(e) => setEditingActivityName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleActivityNameSave()
                        if (e.key === "Escape") handleActivityNameCancel()
                      }}
                      className="text-sm h-7 w-24 px-2 focus:ring-1 focus:ring-emerald-200 border-slate-300 transition-all duration-200"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
                      onClick={handleActivityNameSave}
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs border-slate-300 hover:bg-slate-50 bg-transparent transition-all duration-200"
                      onClick={handleActivityNameCancel}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor={activity.id}
                    className={`text-sm cursor-pointer transition-all duration-200 ${
                      activity.completed ? "text-emerald-600 font-semibold" : "text-slate-700 hover:text-emerald-600"
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleActivityNameClick(activity.id, activity.name)
                    }}
                  >
                    {activity.name}
                  </label>
                )}
              </div>
              <X
                className="w-3 h-3 text-slate-400 cursor-pointer hover:text-rose-500 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                onClick={() => handleDeleteActivity(activity.id)}
              />
            </div>
          ))}

          {isAddingActivity ? (
            <div className="flex items-center gap-2">
              <Input
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddActivity()
                  if (e.key === "Escape") {
                    setNewActivityName("")
                    setIsAddingActivity(false)
                  }
                }}
                placeholder="Activity name"
                className="text-sm h-8 w-32 focus:ring-1 focus:ring-emerald-200 border-slate-300 transition-all duration-200"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleAddActivity}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 bg-transparent transition-all duration-200"
                onClick={() => {
                  setNewActivityName("")
                  setIsAddingActivity(false)
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="border-dashed border-slate-300 text-slate-500 text-sm px-3 py-1.5 h-auto hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200 bg-transparent hover:scale-105"
              onClick={() => setIsAddingActivity(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${getProgressBarColor(progress)} h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-700 min-w-[3rem] text-right">{progress}%</span>
        </div>
      </div>

      {/* Confirmation dialog for chapter deletion */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Chapter"
        message={`Are you sure you want to delete "${chapter.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  )
}
