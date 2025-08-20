"use client"

import { useApp } from "@/contexts/AppContext"
import { calculateSubjectProgress, calculateOverallProgress } from "@/utils/calculations"

export function ProgressStats() {
  const { state } = useApp()

  const subjectStats = state.subjects.map((subject) => {
    const progress = calculateSubjectProgress(subject.chapters)
    const totalChapters = subject.chapters.length
    const completedChapters = subject.chapters.filter(
      (chapter) => chapter.activities.length > 0 && chapter.activities.every((activity) => activity.completed),
    ).length
    const totalActivities = subject.chapters.reduce((sum, chapter) => sum + chapter.activities.length, 0)
    const completedActivities = subject.chapters.reduce(
      (sum, chapter) => sum + chapter.activities.filter((activity) => activity.completed).length,
      0,
    )

    return {
      ...subject,
      progress,
      totalChapters,
      completedChapters,
      totalActivities,
      completedActivities,
    }
  })

  const overallProgress = calculateOverallProgress(state.subjects)
  const totalChapters = subjectStats.reduce((sum, subject) => sum + subject.totalChapters, 0)
  const completedChapters = subjectStats.reduce((sum, subject) => sum + subject.completedChapters, 0)
  const totalActivities = subjectStats.reduce((sum, subject) => sum + subject.totalActivities, 0)
  const completedActivities = subjectStats.reduce((sum, subject) => sum + subject.completedActivities, 0)

  return (
    <div className="space-y-4">
      {/* Overall Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Progress</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedActivities}/{totalActivities}
            </div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">{overallProgress}%</span>
        </div>
      </div>

      {/* Subject-wise Stats */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Subject Progress</h3>
        {subjectStats.map((subject) => (
          <div key={subject.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{subject.name}</h4>
              <span className="text-sm font-medium text-gray-700">{subject.progress}%</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {subject.completedChapters}/{subject.totalChapters}
                </div>
                <div className="text-gray-600">Chapters</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {subject.completedActivities}/{subject.totalActivities}
                </div>
                <div className="text-gray-600">Activities</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{subject.progress}%</div>
                <div className="text-gray-600">Complete</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    subject.id === "physics"
                      ? "bg-blue-500"
                      : subject.id === "chemistry"
                        ? "bg-green-500"
                        : "bg-purple-500"
                  }`}
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
