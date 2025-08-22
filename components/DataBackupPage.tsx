"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import { ChevronLeft, Download, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"

export function DataBackupPage() {
  const { state, dispatch } = useApp()
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")

  const handleBackToChecklist = () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: "checklist" })
  }

  const handleExportData = () => {
    const dataToExport = {
      subjects: state.subjects,
      currentDate: state.currentDate,
      targetDeadline: state.targetDeadline,
      motivationQuote: state.motivationQuote,
      tests: state.tests,
      userProfile: state.userProfile,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `syllabus-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)

        // Validate the imported data structure
        if (!importedData.subjects || !Array.isArray(importedData.subjects)) {
          throw new Error("Invalid data format: subjects array missing")
        }

        // Import the data
        dispatch({ type: "IMPORT_DATA", payload: importedData })
        setImportStatus("success")
        setImportMessage("Data imported successfully! Your backup has been restored.")
      } catch (error) {
        setImportStatus("error")
        setImportMessage("Failed to import data. Please check the file format.")
        console.error("Import error:", error)
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToChecklist}
            className="hover:bg-slate-100 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Data Backup & Restore</h1>
        </div>

        <div className="space-y-6">
          {/* Export Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-800">Export Data</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Download a backup of all your data including subjects, chapters, activities, tests, and settings.
            </p>
            <Button
              onClick={handleExportData}
              className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Backup File
            </Button>
          </div>

          {/* Import Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Import Data</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Restore your data from a previously exported backup file. This will replace all current data.
            </p>

            {importStatus !== "idle" && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                  importStatus === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                }`}
              >
                {importStatus === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="text-sm">{importMessage}</span>
              </div>
            )}

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-file"
              />
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-200 bg-transparent"
                asChild
              >
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Backup File
                </label>
              </Button>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Important Information</h3>
            </div>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• Your data is stored locally in your browser and won't be lost when the website is updated</li>
              <li>• Each user on the same device has separate data storage</li>
              <li>• Export your data regularly to prevent loss due to browser data clearing</li>
              <li>• Importing data will completely replace your current progress</li>
              <li>• Backup files are in JSON format and contain all your study progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
