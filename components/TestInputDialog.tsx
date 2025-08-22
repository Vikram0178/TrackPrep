"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Trash2, AlertCircle } from "lucide-react"

interface TestSubject {
  name: string
  correct: number
  incorrect: number
  unattempted: number
}

interface TestInputDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (testData: any) => void
  editData?: any // Added editData prop for editing existing tests
}

export function TestInputDialog({ isOpen, onClose, onSave, editData }: TestInputDialogProps) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<string[]>([])
  const [testData, setTestData] = useState({
    name: "",
    dateAttempted: "",
    totalQuestions: 0,
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    totalTime: "",
    subjects: [] as TestSubject[],
  })

  useEffect(() => {
    if (editData && isOpen) {
      setTestData({
        name: editData.name || "",
        dateAttempted: editData.dateAttempted || "",
        totalQuestions: editData.totalQuestions || 0,
        correct: editData.correct || 0,
        incorrect: editData.incorrect || 0,
        unattempted: editData.unattempted || 0,
        totalTime: editData.totalTime || "",
        subjects:
          editData.subjects?.map((s: any) => ({
            name: s.name || "",
            correct: s.correct || 0,
            incorrect: s.incorrect || 0,
            unattempted: s.unattempted || 0,
          })) || [],
      })
    } else if (!editData && isOpen) {
      // Reset form for new test
      setTestData({
        name: "",
        dateAttempted: "",
        totalQuestions: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        totalTime: "",
        subjects: [],
      })
      setStep(1)
      setErrors([])
    }
  }, [editData, isOpen])

  const validateStep = (stepNumber: number): string[] => {
    const newErrors: string[] = []

    if (stepNumber === 1) {
      if (!testData.name.trim()) newErrors.push("Test name is required")
      if (!testData.dateAttempted) newErrors.push("Date attempted is required")
      if (testData.totalQuestions <= 0) newErrors.push("Total questions must be greater than 0")
    }

    if (stepNumber === 2) {
      const total = testData.correct + testData.incorrect + testData.unattempted

      if (total !== testData.totalQuestions) {
        newErrors.push(`Total questions breakdown (${total}) must equal total questions (${testData.totalQuestions})`)
      }

      if (
        testData.correct === 0 &&
        testData.incorrect === 0 &&
        testData.unattempted === 0 &&
        testData.totalQuestions > 0
      ) {
        newErrors.push("Cannot have all values as 0 when total questions is greater than 0")
      }

      if (testData.correct < 0 || testData.incorrect < 0 || testData.unattempted < 0) {
        newErrors.push("Question counts cannot be negative")
      }
    }

    if (stepNumber === 3) {
      testData.subjects.forEach((subject, index) => {
        if (!subject.name.trim()) {
          newErrors.push(`Subject ${index + 1} name is required`)
        }

        const subjectTotal = subject.correct + subject.incorrect + subject.unattempted
        if (subjectTotal > testData.totalQuestions) {
          newErrors.push(
            `Subject "${subject.name}" total questions (${subjectTotal}) cannot exceed test total (${testData.totalQuestions})`,
          )
        }

        if (subject.correct < 0 || subject.incorrect < 0 || subject.unattempted < 0) {
          newErrors.push(`Subject "${subject.name}" cannot have negative values`)
        }
      })

      // Check if sum of all subjects equals test totals
      const totalSubjectCorrect = testData.subjects.reduce((sum, s) => sum + s.correct, 0)
      const totalSubjectIncorrect = testData.subjects.reduce((sum, s) => sum + s.incorrect, 0)
      const totalSubjectUnattempted = testData.subjects.reduce((sum, s) => sum + s.unattempted, 0)

      if (testData.subjects.length > 0) {
        if (totalSubjectCorrect !== testData.correct) {
          newErrors.push(
            `Subject-wise correct questions (${totalSubjectCorrect}) must equal total correct (${testData.correct})`,
          )
        }
        if (totalSubjectIncorrect !== testData.incorrect) {
          newErrors.push(
            `Subject-wise incorrect questions (${totalSubjectIncorrect}) must equal total incorrect (${testData.incorrect})`,
          )
        }
        if (totalSubjectUnattempted !== testData.unattempted) {
          newErrors.push(
            `Subject-wise unattempted questions (${totalSubjectUnattempted}) must equal total unattempted (${testData.unattempted})`,
          )
        }
      }
    }

    if (stepNumber === 4) {
      if (!testData.totalTime.trim()) newErrors.push("Total time is required")
    }

    return newErrors
  }

  const handleNext = () => {
    const stepErrors = validateStep(step)
    setErrors(stepErrors)

    if (stepErrors.length === 0 && step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setErrors([])
    if (step > 1) setStep(step - 1)
  }

  const handleSave = () => {
    const stepErrors = validateStep(4)
    setErrors(stepErrors)

    if (stepErrors.length > 0) return

    const totalMarks = testData.correct * 4 - testData.incorrect * 1
    const subjectMarks = testData.subjects.map((subject) => ({
      ...subject,
      marks: subject.correct * 4 - subject.incorrect * 1,
    }))

    const finalTestData = {
      ...testData,
      totalMarks,
      subjects: subjectMarks,
      createdAt: editData?.createdAt || new Date().toISOString(),
    }

    onSave(finalTestData)

    // Reset form only if not editing
    if (!editData) {
      setStep(1)
      setErrors([])
      setTestData({
        name: "",
        dateAttempted: "",
        totalQuestions: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        totalTime: "",
        subjects: [],
      })
    }
    onClose()
  }

  const addSubject = () => {
    setTestData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", correct: 0, incorrect: 0, unattempted: 0 }],
    }))
  }

  const removeSubject = (index: number) => {
    setTestData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }))
  }

  const updateSubject = (index: number, field: keyof TestSubject, value: string | number) => {
    setTestData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => (i === index ? { ...subject, [field]: value } : subject)),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {editData ? "Edit Test Details" : "Add Test Details"} ({step}/4)
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <AlertCircle className="w-4 h-4" />
              Please fix the following errors:
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="testName">Test Name</Label>
              <Input
                id="testName"
                value={testData.name}
                onChange={(e) => setTestData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter test name"
                className={errors.some((e) => e.includes("Test name")) ? "border-red-300" : ""}
              />
            </div>
            <div>
              <Label htmlFor="dateAttempted">Date Attempted</Label>
              <Input
                id="dateAttempted"
                type="date"
                value={testData.dateAttempted}
                onChange={(e) => setTestData((prev) => ({ ...prev, dateAttempted: e.target.value }))}
                className={errors.some((e) => e.includes("Date attempted")) ? "border-red-300" : ""}
              />
            </div>
            <div>
              <Label htmlFor="totalQuestions">Total Questions</Label>
              <Input
                id="totalQuestions"
                type="number"
                min="1"
                value={testData.totalQuestions || ""}
                onChange={(e) =>
                  setTestData((prev) => ({ ...prev, totalQuestions: Number.parseInt(e.target.value) || 0 }))
                }
                placeholder="Enter total questions"
                className={errors.some((e) => e.includes("Total questions")) ? "border-red-300" : ""}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              <strong>Note:</strong> Correct + Incorrect + Unattempted must equal {testData.totalQuestions} total
              questions
            </div>
            <div>
              <Label htmlFor="correct">Correct Questions</Label>
              <Input
                id="correct"
                type="number"
                min="0"
                max={testData.totalQuestions}
                value={testData.correct || ""}
                onChange={(e) => setTestData((prev) => ({ ...prev, correct: Number.parseInt(e.target.value) || 0 }))}
                placeholder="Enter correct questions"
              />
            </div>
            <div>
              <Label htmlFor="incorrect">Incorrect Questions</Label>
              <Input
                id="incorrect"
                type="number"
                min="0"
                max={testData.totalQuestions}
                value={testData.incorrect || ""}
                onChange={(e) => setTestData((prev) => ({ ...prev, incorrect: Number.parseInt(e.target.value) || 0 }))}
                placeholder="Enter incorrect questions"
              />
            </div>
            <div>
              <Label htmlFor="unattempted">Unattempted Questions</Label>
              <Input
                id="unattempted"
                type="number"
                min="0"
                max={testData.totalQuestions}
                value={testData.unattempted || ""}
                onChange={(e) =>
                  setTestData((prev) => ({ ...prev, unattempted: Number.parseInt(e.target.value) || 0 }))
                }
                placeholder="Enter unattempted questions"
              />
            </div>
            <div className="text-sm text-slate-600">
              Current total: {testData.correct + testData.incorrect + testData.unattempted} / {testData.totalQuestions}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Subject-wise Breakdown</h3>
              <Button onClick={addSubject} size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="w-4 h-4 mr-1" />
                Add Subject
              </Button>
            </div>

            {testData.subjects.map((subject, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={subject.name}
                    onChange={(e) => updateSubject(index, "name", e.target.value)}
                    placeholder="Subject name"
                    className="flex-1 mr-2"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubject(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Correct</Label>
                    <Input
                      type="number"
                      min="0"
                      value={subject.correct || ""}
                      onChange={(e) => updateSubject(index, "correct", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Incorrect</Label>
                    <Input
                      type="number"
                      min="0"
                      value={subject.incorrect || ""}
                      onChange={(e) => updateSubject(index, "incorrect", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Unattempted</Label>
                    <Input
                      type="number"
                      min="0"
                      value={subject.unattempted || ""}
                      onChange={(e) => updateSubject(index, "unattempted", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalTime">Total Time (e.g., 3 hours 30 minutes)</Label>
              <Input
                id="totalTime"
                value={testData.totalTime}
                onChange={(e) => setTestData((prev) => ({ ...prev, totalTime: e.target.value }))}
                placeholder="Enter total time taken"
                className={errors.some((e) => e.includes("Total time")) ? "border-red-300" : ""}
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Marking Scheme:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Correct: +4 marks</li>
                <li>• Incorrect: -1 mark</li>
                <li>• Unattempted: 0 marks</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="ml-auto">
            {step < 4 ? (
              <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600">
                Next
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600">
                {editData ? "Update Test" : "Save Test"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
