"use client"

import type React from "react"
import { PlusIcon, BookIcon } from "./ui/icons"

interface EmptyStateProps {
  title: string
  description: string
  actionText: string
  onAction: () => void
  icon?: React.ReactNode
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon = <BookIcon className="w-12 h-12" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="text-slate-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log("[v0] EmptyState button clicked, calling onAction")
          onAction()
        }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200 font-medium"
      >
        <PlusIcon className="w-4 h-4" />
        {actionText}
      </button>
    </div>
  )
}
