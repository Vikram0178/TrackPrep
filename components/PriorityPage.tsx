"use client"

import { useApp } from "@/contexts/AppContext"
import { ArrowLeft } from "lucide-react"
import { calculateChapterProgress } from "@/utils/calculations"
import { useState, useMemo } from "react"

const difficultyColors = {
  easy: "bg-emerald-100 border-emerald-200 text-emerald-800",
  medium: "bg-amber-100 border-amber-200 text-amber-800",
  hard: "bg-rose-100 border-rose-200 text-rose-800",
}

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
}

export function PriorityPage() {
  const { state, dispatch } = useApp()
  const [selectedSubject, setSelectedSubject] = useState<string>(state.subjects[0]?.id || "physics")
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy")

  const handleBack = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  const filteredChapters = useMemo(() => {
    const subject = state.subjects.find((s) => s.id === selectedSubject)

    if (!subject) return []

    return subject.chapters
      .filter((chapter) => {
        return chapter.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase()
      })
      .map((chapter) => ({
        ...chapter,
        subjectName: subject.shortName,
        progress: calculateChapterProgress(chapter.activities),
      }))
  }, [state.subjects, selectedSubject, selectedDifficulty])

  const selectedSubjectData = state.subjects.find((s) => s.id === selectedSubject)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
        <ArrowLeft
          className="w-6 h-6 text-slate-600 dark:text-gray-400 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          onClick={handleBack}
        />
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Priority</h1>
        <div className="w-6 h-6"></div>
      </header>

      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Subject</h2>
          <div className="flex gap-2 flex-wrap">
            {state.subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedSubject === subject.id
                    ? "bg-slate-800 dark:bg-gray-700 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700"
                }`}
              >
                {subject.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Difficulty</h2>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as const).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? `bg-slate-800 dark:bg-gray-700 shadow-sm ${
                        difficulty === "easy"
                          ? "text-emerald-400"
                          : difficulty === "medium"
                            ? "text-amber-400"
                            : "text-rose-400"
                      }`
                    : difficulty === "easy"
                      ? "bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      : difficulty === "medium"
                        ? "bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-400 border-2 border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        : "bg-white dark:bg-gray-800 text-rose-700 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                }`}
              >
                {difficultyLabels[difficulty]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            {difficultyLabels[selectedDifficulty]} Chapters - {selectedSubjectData?.name || "Unknown"}
          </h2>

          {filteredChapters.length === 0 ? (
            <p className="text-slate-500 dark:text-gray-400 text-center py-8">
              No {selectedDifficulty} chapters found for this subject.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-slate-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {chapter.subjectName}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-white">{chapter.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-gray-400">{chapter.progress}%</span>
                  </div>

                  <div className="mt-2 w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        selectedDifficulty === "easy"
                          ? "bg-emerald-500"
                          : selectedDifficulty === "medium"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                      }`}
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
