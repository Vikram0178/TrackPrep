"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { ChevronLeft, Calendar, Bell, RotateCcw, History, Clock } from "lucide-react"

export function RevisionPage() {
  const { state, dispatch } = useApp()
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [showScheduleDialog, setShowScheduleDialog] = useState<string | null>(null)
  const [showHistoryDialog, setShowHistoryDialog] = useState<string | null>(null)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [enableNotification, setEnableNotification] = useState(true)

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            console.log("[v0] Notification permission granted")
          }
        }
      }
    }

    requestNotificationPermission()
    checkDueRevisions()
    const interval = setInterval(checkDueRevisions, 60 * 1000) // Check every minute
    return () => clearInterval(interval)
  }, [state.subjects])

  const checkDueRevisions = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const now = new Date()
      const today = now.toISOString().split("T")[0]
      const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

      console.log("[v0] Checking for due revisions at", currentTime)

      state.subjects.forEach((subject) => {
        subject.chapters.forEach((chapter) => {
          if (
            chapter.scheduledRevisionDate === today &&
            chapter.scheduledRevisionTime === currentTime &&
            chapter.notificationEnabled
          ) {
            console.log("[v0] Sending notification for chapter:", chapter.name)

            const messages = [
              `🎯 Time to conquer "${chapter.name}"! Your future self will thank you! 💪`,
              `🚀 Blast off into "${chapter.name}" revision! The stars align for your success! ⭐`,
              `🔥 Your brain is ready to absorb "${chapter.name}"! Let's make magic happen! ✨`,
              `🎪 Step right up! It's showtime for "${chapter.name}" revision! 🎭`,
              `🌟 The universe conspires for your success! Time to revise "${chapter.name}"! 🌙`,
              `⚡ Power up with "${chapter.name}" revision! You're unstoppable! 💥`,
              `🎨 Paint your mind with "${chapter.name}" knowledge! Masterpiece incoming! 🖼️`,
              `🏆 Champions revise "${chapter.name}" at this hour! Join the elite! 👑`,
              `🌈 After this "${chapter.name}" revision, you'll be closer to your dreams! 🦄`,
              `🎵 The rhythm of success calls! Time to dance with "${chapter.name}"! 💃`,
              `🧠 Feed your brilliant mind with "${chapter.name}"! Genius mode activated! 🤓`,
              `🎊 It's party time for your neurons! "${chapter.name}" revision awaits! 🎉`,
              `🌅 Rise and shine! "${chapter.name}" is your stepping stone to greatness! ☀️`,
              `🎯 Bulls-eye! Perfect timing for "${chapter.name}" mastery! 🏹`,
              `🚂 All aboard the success train! Next stop: "${chapter.name}" expertise! 🚃`,
            ]

            const randomMessage = messages[Math.floor(Math.random() * messages.length)]

            try {
              const notification = new Notification(`📚 JEE Revision Alert!`, {
                body: randomMessage,
                icon: "/favicon.ico",
                tag: `revision-${chapter.id}`,
                requireInteraction: true,
                silent: false,
                badge: "/favicon.ico",
              })

              notification.onclick = () => {
                window.focus()
                notification.close()
              }

              setTimeout(() => {
                notification.close()
              }, 10000)
            } catch (error) {
              console.error("[v0] Error creating notification:", error)
            }
          }
        })
      })
    } else if ("Notification" in window && Notification.permission === "denied") {
      console.log("[v0] Notification permission denied")
    } else if (!("Notification" in window)) {
      console.log("[v0] Browser doesn't support notifications")
    }
  }

  const handleBackToChecklist = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  const handleMarkRevised = (chapterId: string) => {
    dispatch({ type: "MARK_CHAPTER_REVISED", payload: { chapterId } })
  }

  const handleUndoRevision = (chapterId: string) => {
    dispatch({ type: "UNDO_CHAPTER_REVISION", payload: { chapterId } })
  }

  const handleScheduleRevision = (chapterId: string) => {
    if (scheduleDate && scheduleTime) {
      dispatch({
        type: "SCHEDULE_REVISION",
        payload: {
          chapterId,
          date: scheduleDate,
          time: scheduleTime,
          enableNotification,
        },
      })
      setShowScheduleDialog(null)
      setScheduleDate("")
      setScheduleTime("")
      setEnableNotification(true)
    }
  }

  const handleCancelSchedule = (chapterId: string) => {
    dispatch({ type: "CANCEL_REVISION_SCHEDULE", payload: { chapterId } })
  }

  const getRevisionButtonText = (chapter: any) => {
    const count = chapter.revisionCount || 0
    if (count === 0) return "✓"
    return `✓${count}`
  }

  const getFilteredChapters = useMemo(() => {
    let allChapters: Array<{ chapter: any; subjectName: string }> = []

    state.subjects.forEach((subject) => {
      subject.chapters.forEach((chapter) => {
        allChapters.push({ chapter, subjectName: subject.name })
      })
    })

    if (selectedSubject !== "all") {
      const subject = state.subjects.find((s) => s.id === selectedSubject)
      if (subject) {
        allChapters = allChapters.filter((item) => item.subjectName === subject.name)
      }
    }

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

    if (diffDays === 0) return "Revised today"
    if (diffDays === 1) return "Revised yesterday"
    return `Revised ${diffDays} days ago`
  }

  const getScheduleStatus = (chapter: any) => {
    if (!chapter.scheduledRevisionDate) return null

    const today = new Date()
    const scheduled = new Date(chapter.scheduledRevisionDate)
    const diffTime = scheduled.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const timeDisplay = chapter.scheduledRevisionTime ? ` at ${chapter.scheduledRevisionTime}` : ""

    if (diffDays === 0) return `Scheduled for today${timeDisplay}`
    if (diffDays === 1) return `Scheduled for tomorrow${timeDisplay}`
    if (diffDays > 0) return `Scheduled in ${diffDays} days${timeDisplay}`
    return `Overdue by ${Math.abs(diffDays)} days${timeDisplay}`
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

                            if (diffDays < 0) return "bg-red-50 border-2 border-red-200"
                            if (diffDays === 0) return "bg-orange-50 border-2 border-orange-200"
                            if (diffDays <= 3) return "bg-yellow-50 border-2 border-yellow-200"
                            return "bg-blue-50 border-2 border-blue-200"
                          }
                        )()
                      : chapter.lastRevisedDate
                        ? (() => {
                            const now = new Date()
                            const revised = new Date(chapter.lastRevisedDate)
                            const diffDays = Math.floor((now.getTime() - revised.getTime()) / (1000 * 60 * 60 * 24))

                            if (diffDays === 0) return "bg-emerald-50 border-2 border-emerald-200"
                            if (diffDays <= 7) return "bg-green-50 border-2 border-green-200"
                            if (diffDays <= 30) return "bg-slate-50 border-2 border-slate-200"
                            return "bg-gray-50 border-2 border-gray-300"
                          })()
                        : "bg-red-50 border-2 border-red-300"
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
                        {(chapter.revisionCount || 0) > 0 && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                            {chapter.revisionCount} revision{chapter.revisionCount !== 1 ? "s" : ""}
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

                            if (diffDays < 0) return "text-red-700"
                            if (diffDays === 0) return "text-orange-700"
                            if (diffDays <= 3) return "text-yellow-700"
                            return "text-blue-700"
                          })()}`}
                        >
                          <Calendar className="w-3 h-3" />
                          {getScheduleStatus(chapter)}
                          {chapter.notificationEnabled && <Bell className="w-3 h-3" />}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {(chapter.revisionHistory?.length || 0) > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowHistoryDialog(chapter.id)}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      )}
                      {!chapter.scheduledRevisionDate ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowScheduleDialog(chapter.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSchedule(chapter.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          ✕
                        </Button>
                      )}
                      {(chapter.revisionCount || 0) > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUndoRevision(chapter.id)}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleMarkRevised(chapter.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 hover:scale-105 active:scale-95 text-xs px-3 py-1.5"
                      >
                        {getRevisionButtonText(chapter)}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Dialog */}
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Revision Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
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
                    Enable Chrome browser notifications
                  </label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowScheduleDialog(null)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleScheduleRevision(showScheduleDialog)}
                    disabled={!scheduleDate || !scheduleTime}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showHistoryDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Revision History</h3>
              {(() => {
                const chapter = state.subjects.flatMap((s) => s.chapters).find((c) => c.id === showHistoryDialog)

                if (!chapter?.revisionHistory?.length) {
                  return <p className="text-slate-500">No revision history found.</p>
                }

                return (
                  <div className="space-y-3">
                    {chapter.revisionHistory
                      .slice()
                      .reverse()
                      .map((revision, index) => (
                        <div key={revision.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-medium">
                            {chapter.revisionHistory!.length - index}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{revision.date}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {revision.time}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )
              })()}
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setShowHistoryDialog(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
