"use client"

import { X, CheckSquare, BarChart3, Target, Mail, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"

export function Sidebar() {
  const { state, dispatch } = useApp()

  const handlePageChange = (page: "checklist" | "analysis" | "priority" | "howto") => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page })
  }

  const handleClose = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }

  const handleContactDeveloper = () => {
    window.open("mailto:vikramnangaliya@gmail.com", "_blank")
  }

  if (!state.sidebarOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          <Button
            variant={state.currentPage === "checklist" ? "default" : "ghost"}
            className={`w-full justify-start gap-3 h-12 ${
              state.currentPage === "checklist"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => handlePageChange("checklist")}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Checklist</span>
          </Button>

          <Button
            variant={state.currentPage === "priority" ? "default" : "ghost"}
            className={`w-full justify-start gap-3 h-12 ${
              state.currentPage === "priority"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => handlePageChange("priority")}
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Priority</span>
          </Button>

          <Button
            variant={state.currentPage === "analysis" ? "default" : "ghost"}
            className={`w-full justify-start gap-3 h-12 ${
              state.currentPage === "analysis"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => handlePageChange("analysis")}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analysis</span>
          </Button>

          <div className="pt-4 border-t border-gray-200 mt-6">
            <Button
              variant={state.currentPage === "howto" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 h-12 ${
                state.currentPage === "howto"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => handlePageChange("howto")}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">How to Use</span>
            </Button>
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 hover:bg-gray-100 text-gray-700"
              onClick={handleContactDeveloper}
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Contact Developer</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="font-medium">JEE PREPARATION TRACKER</p>
            <p className="text-xs">Tool was made by Vikram Nangaliya</p>
            <p className="text-xs text-emerald-600">vikramnangaliya@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  )
}
