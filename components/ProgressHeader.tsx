"use client"

import { useApp } from "@/contexts/AppContext"
import { calculateOverallProgress, calculateSubjectProgress } from "@/utils/calculations"

export function ProgressHeader() {
  const { state } = useApp()

  const overallProgress = calculateOverallProgress(state.subjects)
  const currentSubject = state.subjects.find((s) => s.id === state.activeSubject)
  const currentSubjectProgress = currentSubject ? calculateSubjectProgress(currentSubject.chapters) : 0

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600 dark:text-slate-400">Overall Progress: </span>
            <span className="font-semibold text-gray-900 dark:text-slate-100">{overallProgress}%</span>
          </div>
          <div className="w-24 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600 dark:text-slate-400">Current Subject: </span>
            <span className="font-semibold text-gray-900 dark:text-slate-100">{currentSubjectProgress}%</span>
          </div>
          <div className="w-24 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentSubjectProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
