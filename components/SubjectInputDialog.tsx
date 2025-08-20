"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface SubjectInputDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, shortName: string) => void
  title: string
}

export function SubjectInputDialog({ isOpen, onClose, onSubmit, title }: SubjectInputDialogProps) {
  const [name, setName] = useState("")
  const [shortName, setShortName] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && shortName.trim()) {
      onSubmit(name.trim(), shortName.trim())
      setName("")
      setShortName("")
      onClose()
    }
  }

  const handleCancel = () => {
    setName("")
    setShortName("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Biology"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Symbol (1-3 characters)</label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value.slice(0, 3))}
              placeholder="e.g., BIO"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              maxLength={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !shortName.trim()}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
