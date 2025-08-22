"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { ChevronLeft, Calendar, Bell } from "lucide-react"

export function RevisionPage() {
  const { state, dispatch } = useApp()
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [showScheduleDialog, setShowScheduleDialog] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState("")
  const [enableNotification, setEnableNotification] = useState(true)

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Check for due revisions and send notifications
    checkDueRevisions()

    // Set up interval to check every hour
    const interval = setInterval(checkDueRevisions, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [state.subjects])

  const checkDueRevisions = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const today = new Date().toISOString().split("T")[0]

      state.subjects.forEach((subject) => {
        subject.chapters.forEach((chapter) => {
          if (chapter.scheduledRevisionDate === today && chapter.notificationEnabled) {
            new Notification(`📚 Revision Reminder`, {
              body: `Hey! It's time to revise "${chapter.name}" chapter today. Let's boost your preparation! 🚀`,
              icon: "/favicon.ico",
              tag: `revision-${chapter.id}`,
            })
          }
        })
      })
    }
  }

  const handleBackToChecklist = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  const handleMarkRevised = (chapterId: string) => {
    dispatch({ type: "MARK_CHAPTER_REVISED", payload: { chapterId } })
  }

  const handleScheduleRevision = (chapterId: string) => {
    if (scheduleDate) {
      dispatch({
        type: "SCHEDULE_REVISION",
        payload: { chapterId, date: scheduleDate, enableNotification },
      })
      setShowScheduleDialog(null)
      setScheduleDate("")
      setEnableNotification(true)
    }
  }

  const handleCancelSchedule = (chapterId: string) => {
    dispatch({ type: "CANCEL_REVISION_SCHEDULE", payload: { chapterId } })
  }

  const getFilteredChapters = useMemo(() => {
    let allChapters: Array<{ chapter: any; subjectName: string }> = []

    state.subjects.forEach((subject) => {
      subject.chapters.forEach((chapter) => {
        allChapters.push({ chapter, subjectName: subject.name })
      })
    })

    // Filter by subject
    if (selectedSubject !== "all") {
      const subject = state.subjects.find((s) => s.id === selectedSubject)
      if (subject) {
        allChapters = allChapters.filter((item) => item.subjectName === subject.name)
      }
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      allChapters = allChapters.filter((item) => item.chapter.difficulty === selectedDifficulty)
    }

    return allChapters
  }, [state.subjects, selectedSubject, selectedDifficulty])

  const getTimeSinceRevision = (lastRevisedDate?: string) => {
    if (!lastRevisedDate) return "Never revised"

    const now = new Date()
    const revised = new Date(lastRevisedDate)
    const diffTime = Math.abs(now.getTime() - revised.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    const formatDate = (date: Date) => {
      const day = date.getDate()
      const suffix =
        day === 1 || day === 21 || day === 31
          ? "st"
          : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
              ? "rd"
              : "th"
      const month = date.toLocaleDateString("en-US", { month: "long" })
      const year = date.getFullYear()
      return `${day}${suffix} ${month}, ${year}`
    }

    if (diffDays === 0) return `Revised today (${formatDate(revised)})`
    if (diffDays === 1) return `Revised yesterday (${formatDate(revised)})`
    return `Revised ${diffDays} days ago (${formatDate(revised)})`
  }

  const getScheduleStatus = (chapter: any) => {
    if (!chapter.scheduledRevisionDate) return null

    const today = new Date()
    const scheduled = new Date(chapter.scheduledRevisionDate)
    const diffTime = scheduled.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Scheduled for today"
    if (diffDays === 1) return "Scheduled for tomorrow"
    if (diffDays > 0) return `Scheduled in ${diffDays} days`
    return `Overdue by ${Math.abs(diffDays)} days`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToChecklist}
            className="hover:bg-slate-100 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Revision Tracker</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Subject</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedSubject === "all" ? "default" : "outline"}
              className={`transition-all duration-200 ${
                selectedSubject === "all"
                  ? "bg-slate-800 hover:bg-slate-900 text-white"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
              onClick={() => setSelectedSubject("all")}
            >
              All
            </Button>
            {state.subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={selectedSubject === subject.id ? "default" : "outline"}
                className={`transition-all duration-200 ${
                  selectedSubject === subject.id
                    ? "bg-slate-800 hover:bg-slate-900 text-white"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                {subject.shortName}
              </Button>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-slate-800 mb-4">Difficulty</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDifficulty === "all" ? "default" : "outline"}
              className={`transition-all duration-200 ${
                selectedDifficulty === "all"
                  ? "bg-slate-800 hover:bg-slate-900 text-white"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
              onClick={() => setSelectedDifficulty("all")}
            >
              All
            </Button>
            {["easy", "medium", "hard"].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                className={`transition-all duration-200 capitalize ${
                  selectedDifficulty === difficulty
                    ? difficulty === "easy"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                      : difficulty === "medium"
                        ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                        : "bg-rose-500 hover:bg-rose-600 text-white border-rose-500"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {selectedDifficulty === "all"
              ? "All"
              : selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}{" "}
            Chapters
            {selectedSubject !== "all" && ` - ${state.subjects.find((s) => s.id === selectedSubject)?.name}`}
          </h2>

          {getFilteredChapters.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <p className="text-slate-500 text-lg">No chapters found for the selected filters.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {getFilteredChapters.map(({ chapter, subjectName }) => (
                <div
                  key={chapter.id}
                  className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
                    chapter.scheduledRevisionDate
                      ? (
                          () => {
                            const today = new Date()
                            const scheduled = new Date(chapter.scheduledRevisionDate)
                            const diffDays = Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                            if (diffDays < 0) return "bg-red-50 border-2 border-red-200" // Overdue
                            if (diffDays === 0) return "bg-orange-50 border-2 border-orange-200" // Due today
                            if (diffDays <= 3) return "bg-yellow-50 border-2 border-yellow-200" // Due soon
                            return "bg-blue-50 border-2 border-blue-200" // Scheduled
                          }
                        )()
                      : chapter.lastRevisedDate
                        ? (() => {
                            const now = new Date()
                            const revised = new Date(chapter.lastRevisedDate)
                            const diffDays = Math.floor((now.getTime() - revised.getTime()) / (1000 * 60 * 60 * 24))

                            if (diffDays === 0) return "bg-emerald-50 border-2 border-emerald-200" // Revised today
                            if (diffDays <= 7) return "bg-green-50 border-2 border-green-200" // Recently revised
                            if (diffDays <= 30) return "bg-slate-50 border-2 border-slate-200" // Needs revision
                            return "bg-gray-50 border-2 border-gray-300" // Long overdue
                          })()
                        : "bg-red-50 border-2 border-red-300" // Never revised
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{chapter.name}</h3>
                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{subjectName}</span>
                        {chapter.difficulty && chapter.difficulty !== "none" && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              chapter.difficulty === "easy"
                                ? "bg-emerald-100 text-emerald-700"
                                : chapter.difficulty === "medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {chapter.difficulty}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{getTimeSinceRevision(chapter.lastRevisedDate)}</p>
                      {chapter.scheduledRevisionDate && (
                        <p
                          className={`text-sm font-medium flex items-center gap-1 ${(() => {
                            const today = new Date()
                            const scheduled = new Date(chapter.scheduledRevisionDate)
                            const diffDays = Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                            if (diffDays < 0) return "text-red-700" // Overdue
                            if (diffDays === 0) return "text-orange-700" // Due today
                            if (diffDays <= 3) return "text-yellow-700" // Due soon
                            return "text-blue-700" // Scheduled
                          })()}`}
                        >
                          <Calendar className="w-3 h-3" />
                          {getScheduleStatus(chapter)}
                          {chapter.notificationEnabled && <Bell className="w-3 h-3" />}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!chapter.scheduledRevisionDate ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowScheduleDialog(chapter.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSchedule(chapter.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel Schedule
                        </Button>
                      )}
                      <Button
                        onClick={() => handleMarkRevised(chapter.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 hover:scale-105 active:scale-95 text-xs px-3 py-1.5"
                      >
                        Revised ✓
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showScheduleDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Schedule Revision</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Revision Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableNotification"
                    checked={enableNotification}
                    onChange={(e) => setEnableNotification(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="enableNotification" className="text-sm text-slate-700 flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    Enable browser notification
                  </label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowScheduleDialog(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleScheduleRevision(showScheduleDialog)}
                    disabled={!scheduleDate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
