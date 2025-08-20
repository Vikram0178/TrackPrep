"use client"

import type React from "react"

import { Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { calculateSubjectProgress } from "@/utils/calculations"
import { ChapterCard } from "@/components/ChapterCard"
import { ProgressHeader } from "@/components/ProgressHeader"
import { Sidebar } from "@/components/Sidebar"
import { AnalysisPage } from "@/components/AnalysisPage"
import { PriorityPage } from "@/components/PriorityPage"
import { HowToUsePage } from "@/components/HowToUsePage"
import { InlineChapterInput } from "@/components/InlineChapterInput"
import { SubjectInputDialog } from "@/components/SubjectInputDialog"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { OnboardingDialog } from "@/components/OnboardingDialog" // Added onboarding dialog import
import { getDailyQuote } from "@/utils/quotes"
import { calculateDaysUntil } from "@/utils/dateUtils"
import { getDynamicGreeting } from "@/utils/greetings"
import { useState, useRef } from "react"
import { StarIcon } from "@/components/ui/icons"
import { DarkModeToggle } from "@/components/DarkModeToggle"

export default function SyllabusChecklist() {
  const { state, dispatch } = useApp()
  const [isEditingDeadline, setIsEditingDeadline] = useState(false)
  const [tempDeadline, setTempDeadline] = useState(state.targetDeadline)
  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false)
  const [showDeleteSubjectDialog, setShowDeleteSubjectDialog] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)

  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const [isLongPressing, setIsLongPressing] = useState(false)

  const showOnboarding = !state.userProfile

  const handleOnboardingComplete = (userInfo: {
    name: string
    exam: string
    year: string
    examDate: string
  }) => {
    dispatch({ type: "SET_USER_PROFILE", payload: userInfo })
  }

  if (state.currentPage === "howto") {
    return (
      <>
        <HowToUsePage />
        <Sidebar />
      </>
    )
  }

  if (state.currentPage === "analysis") {
    return (
      <>
        <AnalysisPage />
        <Sidebar />
      </>
    )
  }

  if (state.currentPage === "priority") {
    return (
      <>
        <PriorityPage />
        <Sidebar />
      </>
    )
  }

  const currentSubject = state.subjects.find((s) => s.id === state.activeSubject)
  const subjectProgresses = state.subjects.map((subject) => ({
    ...subject,
    progress: calculateSubjectProgress(subject.chapters),
  }))

  const handleSubjectChange = (subjectId: string) => {
    dispatch({ type: "SET_ACTIVE_SUBJECT", payload: subjectId })
  }

  const handleMenuClick = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }

  const daysToJEE = calculateDaysUntil(state.targetDeadline)
  const dailyQuote = getDailyQuote()

  const handleDeadlineClick = () => {
    setIsEditingDeadline(true)
  }

  const handleDeadlineSubmit = () => {
    dispatch({ type: "SET_TARGET_DEADLINE", payload: tempDeadline })
    setIsEditingDeadline(false)
  }

  const handleDeadlineCancel = () => {
    setTempDeadline(state.targetDeadline)
    setIsEditingDeadline(false)
  }

  const handleAddSubject = (name: string, shortName: string) => {
    dispatch({ type: "ADD_SUBJECT", payload: { name, shortName } })
  }

  const handleSubjectLongPressStart = (subjectId: string, e: React.MouseEvent | React.TouchEvent) => {
    // Prevent text selection during long press
    e.preventDefault()
    setIsLongPressing(true)

    longPressTimer.current = setTimeout(() => {
      setSubjectToDelete(subjectId)
      setShowDeleteSubjectDialog(true)
      setIsLongPressing(false)
    }, 1000) // 1 second long press
  }

  const handleSubjectLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setIsLongPressing(false)
  }

  const handleDeleteSubjectConfirm = () => {
    if (subjectToDelete) {
      dispatch({ type: "DELETE_SUBJECT", payload: { subjectId: subjectToDelete } })
    }
    setShowDeleteSubjectDialog(false)
    setSubjectToDelete(null)
  }

  const handleDeleteSubjectCancel = () => {
    setShowDeleteSubjectDialog(false)
    setSubjectToDelete(null)
  }

  const examTitle = state.userProfile ? `${state.userProfile.exam} ${state.userProfile.year}` : "JEE Advanced 2026"
  const countdownText = state.userProfile
    ? `${daysToJEE} days to ${state.userProfile.exam}`
    : `${daysToJEE} days to JEE`

  const dynamicGreeting = state.userProfile ? getDynamicGreeting(state.userProfile.name) : ""

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted font-sans transition-colors duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
          <div className="flex items-center gap-3">
            <Menu
              className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-primary transition-all duration-200 hover:scale-110"
              onClick={handleMenuClick}
            />
            <DarkModeToggle />
          </div>
          <div className="flex items-center justify-between w-full ml-4">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">{examTitle}</h1>
            </div>
            <div className="flex flex-col items-end">
              {isEditingDeadline ? (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={tempDeadline}
                    onChange={(e) => setTempDeadline(e.target.value)}
                    className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                  />
                  <button
                    onClick={handleDeadlineSubmit}
                    className="text-emerald-600 text-xs hover:text-emerald-700 transition-colors duration-200"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleDeadlineCancel}
                    className="text-muted-foreground text-xs hover:text-foreground transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleDeadlineClick}
                  className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700 rounded-full px-3 py-1.5 cursor-pointer hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <span className="text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                    {daysToJEE} days left
                  </span>
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">{state.currentDate}</div>
            </div>
          </div>
        </header>

        <ProgressHeader />

        <div className="p-4 space-y-6">
          {state.userProfile && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-700/50 rounded-xl p-3 shadow-sm">
              <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">{dynamicGreeting}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-200/50 dark:border-sky-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-sky-100 dark:bg-sky-800/50 rounded-full">
                <StarIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-sky-700 dark:text-sky-300 font-semibold tracking-tight">Daily Motivation</h2>
            </div>
            <p className="text-foreground italic text-sm leading-relaxed pl-11">"{dailyQuote}"</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {subjectProgresses.map((subject) => (
              <div key={subject.id} className="relative group">
                <Button
                  onClick={() => handleSubjectChange(subject.id)}
                  onMouseDown={(e) => handleSubjectLongPressStart(subject.id, e)}
                  onMouseUp={handleSubjectLongPressEnd}
                  onMouseLeave={handleSubjectLongPressEnd}
                  onTouchStart={(e) => handleSubjectLongPressStart(subject.id, e)}
                  onTouchEnd={handleSubjectLongPressEnd}
                  className={`
                    ${
                      state.activeSubject === subject.id
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
                        : "border-slate-300 text-slate-600 rounded-full px-6 py-2.5 text-sm font-medium bg-white hover:bg-slate-50 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                    }
                    ${isLongPressing ? "scale-95 opacity-75" : ""}
                    select-none user-select-none
                  `}
                  variant={state.activeSubject === subject.id ? "default" : "outline"}
                  style={{
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                  }}
                >
                  {subject.shortName} ({subject.progress}%)
                </Button>
              </div>
            ))}

            {/* Add Subject Button */}
            <button
              onClick={() => setShowAddSubjectDialog(true)}
              className="w-10 h-10 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
              title="Add Subject"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {currentSubject?.chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
            <InlineChapterInput subject={state.activeSubject} />
          </div>
        </div>
      </div>

      <Sidebar />

      <OnboardingDialog isOpen={showOnboarding} onComplete={handleOnboardingComplete} />

      <SubjectInputDialog
        isOpen={showAddSubjectDialog}
        onClose={() => setShowAddSubjectDialog(false)}
        onSubmit={handleAddSubject}
        title="Add New Subject"
      />

      <ConfirmDialog
        isOpen={showDeleteSubjectDialog}
        onClose={handleDeleteSubjectCancel}
        onCancel={handleDeleteSubjectCancel}
        onConfirm={handleDeleteSubjectConfirm}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? All chapters and activities will be permanently removed."
      />
    </>
  )
}
