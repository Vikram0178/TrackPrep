export interface Activity {
  id: string
  name: string
  completed: boolean
}

export interface Chapter {
  id: string
  name: string
  subject: string // Changed to string to support custom subjects
  activities: Activity[]
  targetDate?: string
  difficulty?: "easy" | "medium" | "hard" | "none"
}

export interface Subject {
  id: string // Changed to string to support custom subjects
  name: string
  shortName: string
  chapters: Chapter[]
}

export interface UserProfile {
  name: string
  exam: string
  year: string
  examDate: string
}

export interface AppState {
  subjects: Subject[]
  activeSubject: string // Changed to string to support custom subjects
  sidebarOpen: boolean
  currentPage: "checklist" | "analysis" | "priority" | "howto" // Added howto page type
  targetDeadline: string
  currentDate: string
  loading: boolean
  userProfile?: UserProfile // Added optional user profile to state
  isDarkMode: boolean // Added dark mode state to AppState interface
}
