"use client"

import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-300 hover:bg-slate-50 bg-transparent transition-all duration-200"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-rose-500 hover:bg-rose-600 text-white transition-all duration-200">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
