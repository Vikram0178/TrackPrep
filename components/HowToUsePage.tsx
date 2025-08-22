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
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={handleBackToChecklist} className="hover:bg-white/50">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">How to Use JEE Tracker</h1>
      </div>

      {/* Guide Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Getting Started */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-green-600" />
            Getting Started
          </h2>
          <div className="space-y-3 text-gray-700">
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Managing Subjects
          </h2>
          <div className="space-y-3 text-gray-700">
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
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Chapter Features
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              • <strong>Chapter Checkbox:</strong> Check the chapter checkbox to mark all activities as complete
            </p>
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
              • <strong>Long Press Delete:</strong> Long press activities for 1 second to delete them
            </p>
            <p>
              • <strong>Progress Bar:</strong> Colors change from red to green as you complete activities
            </p>
          </div>
        </div>

        {/* Revision System */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Revision System
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              • <strong>Mark as Revised:</strong> Click "Revised ✓" button to record when you revised a chapter
            </p>
            <p>
              • <strong>Schedule Revision:</strong> Set future dates for chapter revision with browser notifications
            </p>
            <p>
              • <strong>Revision History:</strong> See "revised today/yesterday/x days ago" with exact dates
            </p>
            <p>
              • <strong>Notifications:</strong> Enable browser notifications to get reminded of scheduled revisions
            </p>
            <p>
              • <strong>Filter by Subject:</strong> View revision status by specific subjects and difficulty levels
            </p>
          </div>
        </div>

        {/* Test System */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Test Tracking System
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              • <strong>Add Tests:</strong> Record test details including name, date, and question breakdown
            </p>
            <p>
              • <strong>Subject-wise Analysis:</strong> Track performance across different subjects separately
            </p>
            <p>
              • <strong>Automatic Scoring:</strong> Uses +4 for correct, -1 for incorrect, 0 for unattempted
            </p>
            <p>
              • <strong>Edit/Delete Tests:</strong> Use pencil and trash icons to modify or remove test records
            </p>
            <p>
              • <strong>Performance Insights:</strong> View accuracy rates, time analysis, and improvement trends
            </p>
            <p>
              • <strong>Validation:</strong> System prevents illogical data entry with smart error checking
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Data Management
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              • <strong>Data Backup:</strong> Export all your data as JSON files for safekeeping
            </p>
            <p>
              • <strong>Data Import:</strong> Restore your progress by importing previously exported files
            </p>
            <p>
              • <strong>Local Storage:</strong> Data persists locally - no internet required for basic functionality
            </p>
            <p>
              • <strong>Contact Options:</strong> Reach developer via WhatsApp, Email, or Telegram for support
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Navigation & Analysis
          </h2>
          <div className="space-y-3 text-gray-700">
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
              • <strong>Revision:</strong> Track and schedule chapter revisions with notifications
            </p>
            <p>
              • <strong>Tests:</strong> Add and manage test records with performance tracking
            </p>
            <p>
              • <strong>Test Analysis:</strong> View detailed test performance and trends
            </p>
            <p>
              • <strong>Data Backup:</strong> Export and import your study data
            </p>
            <p>
              • <strong>Sidebar:</strong> Click the hamburger menu (☰) to navigate between sections
            </p>
          </div>
        </div>

        {/* Tips & Tricks */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Tips & Tricks
          </h2>
          <div className="space-y-3 text-green-800">
            <p>
              • <strong>Data Persistence:</strong> Your progress is automatically saved locally
            </p>
            <p>
              • <strong>Daily Motivation:</strong> New quotes appear every hour to keep you motivated
            </p>
            <p>
              • <strong>RGB Light Effect:</strong> Click the daily motivation box to toggle colorful border lights
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
              • <strong>Regular Backup:</strong> Export your data weekly to prevent loss
            </p>
            <p>
              • <strong>Test Tracking:</strong> Record all practice tests to monitor improvement
            </p>
            <p>
              • <strong>Revision Schedule:</strong> Set up notifications for systematic revision
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
