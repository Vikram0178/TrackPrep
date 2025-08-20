"use client"

import { useState } from "react"

interface OnboardingDialogProps {
  isOpen: boolean
  onComplete: (userInfo: {
    name: string
    exam: string
    year: string
    examDate: string
  }) => void
}

export function OnboardingDialog({ isOpen, onComplete }: OnboardingDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    exam: "",
    year: "",
    examDate: "",
  })

  if (!isOpen) return null

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0
      case 2:
        return formData.exam.trim().length > 0
      case 3:
        return formData.year.trim().length > 0
      case 4:
        return formData.examDate.trim().length > 0
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Welcome! Let's get started</h2>
          <div className="text-sm text-gray-500">{step}/4</div>
        </div>

        <div className="mb-6">
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What's your name?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Which exam are you preparing for?</label>
              <input
                type="text"
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                placeholder="e.g., JEE Advanced, NEET, CAT"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which year will you appear for the exam?
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="e.g., 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">When is your exam date?</label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {step === 4 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}
