"use client"

import { ArrowLeft, TrendingUp, Target, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { ProgressStats } from "@/components/ProgressStats"
import { calculateOverallProgress, getDetailedProgressStats } from "@/utils/calculations"

export function AnalysisPage() {
  const { state, dispatch } = useApp()

  const overallProgress = calculateOverallProgress(state.subjects)
  const detailedStats = getDetailedProgressStats(state.subjects)

  const totalChapters = detailedStats.reduce((sum, subject) => sum + subject.totalChapters, 0)
  const completedChapters = detailedStats.reduce((sum, subject) => sum + subject.completedChapters, 0)
  const totalActivities = detailedStats.reduce((sum, subject) => sum + subject.totalActivities, 0)
  const completedActivities = detailedStats.reduce((sum, subject) => sum + subject.completedActivities, 0)

  const safeOverallProgress = isNaN(overallProgress) ? 0 : overallProgress

  const handleBackToChecklist = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBackToChecklist}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Progress Analysis</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{safeOverallProgress}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedChapters}/{totalChapters}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Chapters Done</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedActivities}/{totalActivities}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Activities Done</div>
          </div>
        </div>

        {/* Detailed Progress Stats */}
        <ProgressStats />

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
          <div className="space-y-3">
            {safeOverallProgress < 30 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Focus on Consistency</p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Your progress is below 30%. Try to complete at least 2-3 activities daily.
                  </p>
                </div>
              </div>
            )}

            {safeOverallProgress >= 30 && safeOverallProgress < 70 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Good Progress</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    You're making steady progress. Focus on completing weaker subjects.
                  </p>
                </div>
              </div>
            )}

            {safeOverallProgress >= 70 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">Excellent Progress</p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Great work! Focus on revision and practice tests now.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Stay Consistent</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Maintain your daily study routine and complete activities regularly to achieve your goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
