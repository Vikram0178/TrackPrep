"use client"

import { useApp } from "@/contexts/AppContext"
import { useState } from "react"

export function Sidebar() {
  const { state, dispatch } = useApp()
  const [showContactOptions, setShowContactOptions] = useState(false)

  const handlePageChange = (
    page: "checklist" | "analysis" | "priority" | "howto" | "revision" | "test" | "testanalysis" | "databackup",
  ) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page })
  }

  const handleClose = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }

  const handleContactDeveloper = () => {
    setShowContactOptions(!showContactOptions)
  }

  const handleContactMethod = (method: "whatsapp" | "email" | "telegram") => {
    switch (method) {
      case "whatsapp":
        window.open("https://wa.me/918591655390", "_blank")
        break
      case "email":
        window.open("mailto:vikramnangaliya@gmail.com", "_blank")
        break
      case "telegram":
        window.open("https://t.me/Stark0FK", "_blank")
        break
    }
    setShowContactOptions(false)
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

          <div className="pt-2 relative">
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

            {showContactOptions && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1">
                <button
                  onClick={() => handleContactMethod("whatsapp")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => handleContactMethod("email")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Email</span>
                </button>

                <button
                  onClick={() => handleContactMethod("telegram")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  <span>Telegram</span>
                </button>
              </div>
            )}
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
