"use client"

import type React from "react"
import { useApp } from "@/contexts/AppContext"
import { calculateSubjectProgress } from "@/utils/calculations"
import { ChapterCard } from "@/components/ChapterCard"
import { ProgressHeader } from "@/components/ProgressHeader"
import { Sidebar } from "@/components/Sidebar"
import { AnalysisPage } from "@/components/AnalysisPage"
import { PriorityPage } from "@/components/PriorityPage"
import { HowToUsePage } from "@/components/HowToUsePage"
import { RevisionPage } from "@/components/RevisionPage"
import { TestPage } from "@/components/TestPage"
import { TestAnalysisPage } from "@/components/TestAnalysisPage"
import { DataBackupPage } from "@/components/DataBackupPage"
import { InlineChapterInput } from "@/components/InlineChapterInput"
import { SubjectInputDialog } from "@/components/SubjectInputDialog"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { OnboardingDialog } from "@/components/OnboardingDialog"
import { getDailyQuote } from "@/utils/quotes"
import { calculateDaysUntil } from "@/utils/dateUtils"
import { getDynamicGreeting } from "@/utils/greetings"
import { useState, useRef } from "react"

export default function SyllabusChecklist() {
  const { state, dispatch } = useApp()
  const [isEditingDeadline, setIsEditingDeadline] = useState(false)
  const [tempDeadline, setTempDeadline] = useState(state.targetDeadline)
  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false)
  const [showDeleteSubjectDialog, setShowDeleteSubjectDialog] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)
  const [isRgbLightOn, setIsRgbLightOn] = useState(true)

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

  if (state.currentPage === "revision") {
    return (
      <>
        <RevisionPage />
        <Sidebar />
      </>
    )
  }

  if (state.currentPage === "test") {
    return (
      <>
        <TestPage />
        <Sidebar />
      </>
    )
  }

  if (state.currentPage === "testanalysis") {
    return (
      <>
        <TestAnalysisPage />
        <Sidebar />
      </>
    )
  }

  if (state.currentPage === "databackup") {
    return (
      <>
        <DataBackupPage />
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

  const handleMotivationBoxClick = () => {
    setIsRgbLightOn(!isRgbLightOn)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans transition-colors duration-300">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900 transition-all duration-200 hover:scale-110 flex flex-col justify-center items-center gap-1"
              onClick={handleMenuClick}
            >
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
              <div className="w-4 h-0.5 bg-current"></div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full ml-4">
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{examTitle}</h1>
            </div>
            <div className="flex flex-col items-end">
              {isEditingDeadline ? (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={tempDeadline}
                    onChange={(e) => setTempDeadline(e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                  />
                  <button
                    onClick={handleDeadlineSubmit}
                    className="text-green-600 text-xs hover:text-green-700 transition-colors duration-200"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleDeadlineCancel}
                    className="text-red-600 text-xs hover:text-red-700 transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleDeadlineClick}
                  className="bg-green-100 hover:bg-green-200 border border-green-200 rounded-full px-3 py-1.5 cursor-pointer transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-green-800 text-xs font-medium">{daysToJEE} days left</span>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">{state.currentDate}</div>
            </div>
          </div>
        </header>

        <ProgressHeader />

        <div className="p-4 space-y-6">
          {state.userProfile && (
            <div className="bg-green-100 border border-green-200 rounded-xl p-3">
              <p className="text-green-800 text-sm font-medium">{dynamicGreeting}</p>
            </div>
          )}

          <div
            className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden cursor-pointer neon-border ${
              isRgbLightOn ? "" : "neon-off"
            }`}
            onClick={handleMotivationBoxClick}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <div className="w-4 h-4 text-blue-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-gray-800 font-semibold tracking-tight">Daily Motivation</h2>
              </div>
              <p className="text-gray-700 italic text-sm leading-relaxed pl-11">"{dailyQuote}"</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {subjectProgresses.map((subject, index) => {
              return (
                <div key={subject.id} className="relative group">
                  <button
                    onClick={() => handleSubjectChange(subject.id)}
                    onMouseDown={(e) => handleSubjectLongPressStart(subject.id, e)}
                    onMouseUp={handleSubjectLongPressEnd}
                    onMouseLeave={handleSubjectLongPressEnd}
                    onTouchStart={(e) => handleSubjectLongPressStart(subject.id, e)}
                    onTouchEnd={handleSubjectLongPressEnd}
                    className={`
                      ${
                        state.activeSubject === subject.id
                          ? "bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
                          : "border-2 border-gray-300 text-gray-700 rounded-full px-6 py-2.5 text-sm font-medium bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 hover:border-gray-400"
                      }
                      ${isLongPressing ? "scale-95 opacity-75" : ""}
                      select-none user-select-none
                    `}
                    tabIndex={-1}
                    style={{
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                      userSelect: "none",
                      WebkitTouchCallout: "none",
                    }}
                  >
                    {subject.shortName} ({subject.progress}%)
                  </button>
                </div>
              )
            })}

            <button
              onClick={() => setShowAddSubjectDialog(true)}
              className="w-10 h-10 bg-green-100 hover:bg-green-200 text-green-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 border border-green-200"
              title="Add Subject"
            >
              <span className="text-lg font-bold">+</span>
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
