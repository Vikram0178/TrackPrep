"use client"

import { ArrowLeft, Plus, Target, CheckSquare, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"

export function HowToUsePage() {
  const { dispatch } = useApp()

  const handleBackToChecklist = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToChecklist}
          className="hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">How to Use JEE Tracker</h1>
      </div>

      {/* Guide Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Getting Started */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            Getting Started
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              • <strong>First Time:</strong> Enter your name, exam details, and target date for personalization
            </p>
            <p>
              • <strong>Subjects:</strong> Start with Physics (P), Chemistry (C), and Mathematics (M) tabs
            </p>
            <p>
              • <strong>Add Chapters:</strong> Click the dashed "Add Chapter" box to create new chapters
            </p>
            <p>
              • <strong>Activities:</strong> Each chapter can have Notes, DPP, and Module activities
            </p>
            <p>
              • <strong>Progress:</strong> Check off activities as you complete them to track progress
            </p>
          </div>
        </div>

        {/* Managing Subjects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Managing Subjects
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              • <strong>Add Subject:</strong> Click the + button next to subject tabs to add custom subjects
            </p>
            <p>
              • <strong>Delete Subject:</strong> Long press any subject tab for 1 second to delete it
            </p>
            <p>
              • <strong>Custom Symbols:</strong> Choose 1-3 character symbols (like BIO for Biology)
            </p>
            <p>
              • <strong>Wrapping:</strong> Subjects automatically wrap to new rows when screen is full
            </p>
          </div>
        </div>

        {/* Chapter Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Chapter Features
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              • <strong>Rename:</strong> Click on any chapter name to edit it inline
            </p>
            <p>
              • <strong>Difficulty:</strong> Set Easy (green), Medium (yellow), Hard (red), or None
            </p>
            <p>
              • <strong>Target Date:</strong> Click Target button to set deadlines for chapters
            </p>
            <p>
              • <strong>Activities:</strong> Add custom activities with the + button, rename by clicking
            </p>
            <p>
              • <strong>Progress Bar:</strong> Colors change from red to green as you complete activities
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Navigation & Analysis
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              • <strong>Checklist:</strong> Main page for managing chapters and activities
            </p>
            <p>
              • <strong>Priority:</strong> Filter chapters by subject and difficulty level
            </p>
            <p>
              • <strong>Analysis:</strong> View detailed progress statistics and insights
            </p>
            <p>
              • <strong>Sidebar:</strong> Click the hamburger menu (☰) to navigate between sections
            </p>
          </div>
        </div>

        {/* Tips & Tricks */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
          <h2 className="text-xl font-semibold text-emerald-900 dark:text-emerald-300 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Tips & Tricks
          </h2>
          <div className="space-y-3 text-emerald-800 dark:text-emerald-200">
            <p>
              • <strong>Data Persistence:</strong> Your progress is automatically saved locally
            </p>
            <p>
              • <strong>Daily Motivation:</strong> New quotes appear every hour to keep you motivated
            </p>
            <p>
              • <strong>Personal Greetings:</strong> Get unique motivational messages each time you visit
            </p>
            <p>
              • <strong>Color Coding:</strong> Use difficulty colors to prioritize your study plan
            </p>
            <p>
              • <strong>Target Deadlines:</strong> Set realistic deadlines to stay on track
            </p>
            <p>
              • <strong>Regular Review:</strong> Check Analysis page weekly to monitor progress
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
