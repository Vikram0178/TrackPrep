"use client"

import { useApp } from "@/contexts/AppContext"

export function Sidebar() {
  const { state, dispatch } = useApp()

  const handlePageChange = (
    page: "checklist" | "analysis" | "priority" | "howto" | "revision" | "test" | "testanalysis" | "databackup",
  ) => {
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
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button onClick={handleClose} className="text-gray-600 hover:text-gray-800 transition-colors text-xl">
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          <button
            className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
              state.currentPage === "checklist"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => handlePageChange("checklist")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Checklist</span>
          </button>

          <button
            className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
              state.currentPage === "priority"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => handlePageChange("priority")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Priority</span>
          </button>

          <button
            className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
              state.currentPage === "revision"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => handlePageChange("revision")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span>Revision</span>
          </button>

          <button
            className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
              state.currentPage === "test"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => handlePageChange("test")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <span>Test</span>
          </button>

          <button
            className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
              state.currentPage === "testanalysis"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => handlePageChange("testanalysis")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span>Test Analysis</span>
          </button>

          <button
            className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
              state.currentPage === "analysis"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => handlePageChange("analysis")}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span>Analysis</span>
          </button>

          <div className="pt-4 border-t border-gray-200 mt-6">
            <button
              className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
                state.currentPage === "databackup"
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => handlePageChange("databackup")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              <span>Data Backup</span>
            </button>

            <button
              className={`w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 ${
                state.currentPage === "howto"
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => handlePageChange("howto")}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  clipRule="evenodd"
                />
              </svg>
              <span>How to Use</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              className="w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg font-medium transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              onClick={handleContactDeveloper}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Contact Developer</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="font-medium text-gray-800">JEE PREPARATION TRACKER</p>
            <p className="text-xs">Tool was made by Vikram Nangaliya</p>
            <p className="text-xs text-green-600">vikramnangaliya@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  )
}
