"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { TestInputDialog } from "@/components/TestInputDialog"

export function TestAnalysisPage() {
  const { state, dispatch } = useApp()
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set())
  const [editingTest, setEditingTest] = useState<any>(null)
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null)

  const handleBackToChecklist = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  const toggleTestExpansion = (testId: string) => {
    const newExpanded = new Set(expandedTests)
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId)
    } else {
      newExpanded.add(testId)
    }
    setExpandedTests(newExpanded)
  }

  const handleEditTest = (test: any) => {
    setEditingTest(test)
  }

  const handleDeleteTest = (testId: string) => {
    setDeletingTestId(testId)
  }

  const confirmDeleteTest = () => {
    if (deletingTestId) {
      dispatch({ type: "DELETE_TEST", payload: { testId: deletingTestId } })
      setDeletingTestId(null)
    }
  }

  const cancelDeleteTest = () => {
    setDeletingTestId(null)
  }

  const handleEditTestSave = (testData: any) => {
    if (editingTest) {
      dispatch({ type: "EDIT_TEST", payload: { testId: editingTest.id || editingTest.createdAt, testData } })
      setEditingTest(null)
    }
  }

  const analysisData = useMemo(() => {
    if (!state.tests || state.tests.length === 0) return null

    const tests = state.tests
    const totalTests = tests.length
    const averageMarks = tests.reduce((sum: number, test: any) => sum + test.totalMarks, 0) / totalTests
    const bestScore = Math.max(...tests.map((test: any) => test.totalMarks))
    const worstScore = Math.min(...tests.map((test: any) => test.totalMarks))

    const totalCorrect = tests.reduce((sum: number, test: any) => sum + test.correct, 0)
    const totalAttempted = tests.reduce((sum: number, test: any) => sum + test.correct + test.incorrect, 0)
    const accuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(1) : 0

    const subjectStats: { [key: string]: { correct: number; incorrect: number; total: number } } = {}

    tests.forEach((test: any) => {
      if (test.subjects) {
        test.subjects.forEach((subject: any) => {
          if (!subjectStats[subject.name]) {
            subjectStats[subject.name] = { correct: 0, incorrect: 0, total: 0 }
          }
          subjectStats[subject.name].correct += subject.correct
          subjectStats[subject.name].incorrect += subject.incorrect
          subjectStats[subject.name].total += subject.correct + subject.incorrect + subject.unattempted
        })
      }
    })

    return {
      totalTests,
      averageMarks: averageMarks.toFixed(1),
      bestScore,
      worstScore,
      accuracy,
      subjectStats,
    }
  }, [state.tests])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
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
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Test Analysis</h1>
        </div>

        {!analysisData ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <p className="text-slate-500 text-lg">No test data available for analysis.</p>
            <p className="text-slate-400 text-sm mt-2">Add some tests to see detailed analytics.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm text-center transform hover:scale-105 transition-all duration-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{analysisData.totalTests}</div>
                <div className="text-sm text-slate-500">Total Tests</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center transform hover:scale-105 transition-all duration-200">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{analysisData.averageMarks}</div>
                <div className="text-sm text-slate-500">Average Marks</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center transform hover:scale-105 transition-all duration-200">
                <div className="text-3xl font-bold text-green-600 mb-2">{analysisData.bestScore}</div>
                <div className="text-sm text-slate-500">Best Score</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center transform hover:scale-105 transition-all duration-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">{analysisData.accuracy}%</div>
                <div className="text-sm text-slate-500">Accuracy</div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                🎯 Performance Insights
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  📈
                  <div>
                    <div className="font-medium text-emerald-800">Best Performance</div>
                    <div className="text-sm text-emerald-600">Highest score: {analysisData.bestScore} marks</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  📉
                  <div>
                    <div className="font-medium text-amber-800">Room for Improvement</div>
                    <div className="text-sm text-amber-600">Lowest score: {analysisData.worstScore} marks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Test Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Individual Test Analysis</h2>
              <div className="space-y-4">
                {state.tests?.map((test: any, index: number) => {
                  const isExpanded = expandedTests.has(test.id || test.createdAt)
                  const accuracy =
                    test.correct + test.incorrect > 0
                      ? ((test.correct / (test.correct + test.incorrect)) * 100).toFixed(1)
                      : 0

                  return (
                    <div
                      key={test.id || test.createdAt}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className="p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => toggleTestExpansion(test.id || test.createdAt)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {isExpanded ? "▲" : "▼"}
                              <h3 className="font-semibold text-slate-800">{test.name}</h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">📅 {formatDate(test.dateAttempted)}</div>
                              <div className="flex items-center gap-1">⏰ {test.totalTime}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditTest(test)
                                }}
                                className="hover:bg-blue-50 text-blue-600 transition-all duration-200 p-2"
                                title="Edit test"
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTest(test.id || test.createdAt)
                                }}
                                className="hover:bg-red-50 text-red-600 transition-all duration-200 p-2"
                                title="Delete test"
                              >
                                🗑️
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-600">{test.totalMarks}</div>
                              <div className="text-xs text-slate-500">marks</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{accuracy}%</div>
                              <div className="text-xs text-slate-500">accuracy</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t bg-white animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Overall Performance */}
                            <div>
                              <h4 className="font-semibold text-slate-800 mb-3">Overall Performance</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Total Questions:</span>
                                  <span className="font-medium">{test.totalQuestions}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-600">Correct:</span>
                                  <span className="font-medium text-emerald-600">{test.correct}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-red-500">Incorrect:</span>
                                  <span className="font-medium text-red-500">{test.incorrect}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Unattempted:</span>
                                  <span className="font-medium text-slate-500">{test.unattempted}</span>
                                </div>
                              </div>
                            </div>

                            {/* Subject-wise Breakdown */}
                            {test.subjects && test.subjects.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  📚 Subject-wise Analysis
                                </h4>
                                <div className="space-y-3">
                                  {test.subjects.map((subject: any, subIndex: number) => {
                                    const subjectAccuracy =
                                      subject.correct + subject.incorrect > 0
                                        ? ((subject.correct / (subject.correct + subject.incorrect)) * 100).toFixed(1)
                                        : 0

                                    return (
                                      <div
                                        key={subIndex}
                                        className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <h5 className="font-medium text-slate-800">{subject.name}</h5>
                                          <span className="text-sm font-bold text-emerald-600">
                                            {subject.marks} marks
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 text-xs">
                                          <div className="text-center">
                                            <div className="font-medium text-emerald-600">{subject.correct}</div>
                                            <div className="text-slate-500">Correct</div>
                                          </div>
                                          <div className="text-center">
                                            <div className="font-medium text-red-500">{subject.incorrect}</div>
                                            <div className="text-slate-500">Incorrect</div>
                                          </div>
                                          <div className="text-center">
                                            <div className="font-medium text-slate-500">{subject.unattempted}</div>
                                            <div className="text-slate-500">Unattempted</div>
                                          </div>
                                          <div className="text-center">
                                            <div className="font-medium text-blue-600">{subjectAccuracy}%</div>
                                            <div className="text-slate-500">Accuracy</div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Overall Subject-wise Performance */}
            {Object.keys(analysisData.subjectStats).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Overall Subject-wise Performance</h2>
                <div className="space-y-4">
                  {Object.entries(analysisData.subjectStats).map(([subject, stats]) => {
                    const accuracy =
                      stats.correct + stats.incorrect > 0
                        ? ((stats.correct / (stats.correct + stats.incorrect)) * 100).toFixed(1)
                        : 0
                    const marks = stats.correct * 4 - stats.incorrect * 1

                    return (
                      <div key={subject} className="border rounded-lg p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-slate-800">{subject}</h3>
                          <span className="text-lg font-bold text-emerald-600">{marks} marks</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-emerald-600">{stats.correct}</div>
                            <div className="text-slate-500">Correct</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-red-500">{stats.incorrect}</div>
                            <div className="text-slate-500">Incorrect</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{accuracy}%</div>
                            <div className="text-slate-500">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TestInputDialog and ConfirmDialog */}
        {editingTest && (
          <TestInputDialog
            isOpen={true}
            onClose={() => setEditingTest(null)}
            onSave={handleEditTestSave}
            editData={editingTest}
          />
        )}

        {deletingTestId && (
          <ConfirmDialog
            isOpen={true}
            title="Delete Test"
            message="Are you sure you want to delete this test? This action cannot be undone."
            onConfirm={confirmDeleteTest}
            onCancel={cancelDeleteTest}
          />
        )}
      </div>
    </div>
  )
}
