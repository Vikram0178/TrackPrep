"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { ChevronLeft, Plus, Edit3, Trash2 } from "lucide-react"
import { TestInputDialog } from "./TestInputDialog"
import { ConfirmDialog } from "./ConfirmDialog"

export function TestPage() {
  const { state, dispatch } = useApp()
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [editingTest, setEditingTest] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; testId: string | null }>({
    show: false,
    testId: null,
  })

  const handleBackToChecklist = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  const handleSaveTest = (testData: any) => {
    if (editingTest) {
      dispatch({ type: "EDIT_TEST", payload: { testId: editingTest.id, testData } })
      setEditingTest(null)
    } else {
      dispatch({ type: "ADD_TEST", payload: testData })
    }
  }

  const handleEditTest = (test: any) => {
    setEditingTest(test)
    setShowTestDialog(true)
  }

  const handleDeleteTest = (testId: string) => {
    setDeleteConfirm({ show: true, testId })
  }

  const confirmDeleteTest = () => {
    if (deleteConfirm.testId) {
      dispatch({ type: "DELETE_TEST", payload: deleteConfirm.testId })
    }
    setDeleteConfirm({ show: false, testId: null })
  }

  const cancelDeleteTest = () => {
    setDeleteConfirm({ show: false, testId: null })
  }

  const handleCloseDialog = () => {
    setShowTestDialog(false)
    setEditingTest(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToChecklist}
              className="hover:bg-slate-100 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-slate-800">Test Tracker</h1>
          </div>

          <Button onClick={() => setShowTestDialog(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Test Details
          </Button>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          {state.tests && state.tests.length > 0 ? (
            state.tests.map((test: any) => (
              <div key={test.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">{test.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">{new Date(test.dateAttempted).toLocaleDateString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTest(test)}
                      className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTest(test.id)}
                      className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{test.correct}</div>
                    <div className="text-sm text-slate-500">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{test.incorrect}</div>
                    <div className="text-sm text-slate-500">Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">{test.unattempted}</div>
                    <div className="text-sm text-slate-500">Unattempted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{test.totalMarks}</div>
                    <div className="text-sm text-slate-500">Total Marks</div>
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  <span className="font-medium">Time:</span> {test.totalTime} |
                  <span className="font-medium"> Questions:</span> {test.totalQuestions}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <p className="text-slate-500 text-lg mb-4">No tests recorded yet.</p>
              <Button
                onClick={() => setShowTestDialog(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Test
              </Button>
            </div>
          )}
        </div>

        <TestInputDialog
          isOpen={showTestDialog}
          onClose={handleCloseDialog}
          onSave={handleSaveTest}
          editData={editingTest}
        />

        <ConfirmDialog
          isOpen={deleteConfirm.show}
          title="Delete Test"
          message="Are you sure you want to delete this test? This action cannot be undone."
          onConfirm={confirmDeleteTest}
          onCancel={cancelDeleteTest}
        />
      </div>
    </div>
  )
}
