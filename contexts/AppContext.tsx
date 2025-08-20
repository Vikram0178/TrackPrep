"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { AppState, UserProfile } from "@/types"
import { getCurrentDate } from "@/utils/dateUtils"

const initialState: AppState = {
  subjects: [
    {
      id: "physics",
      name: "Physics",
      shortName: "P",
      chapters: [], // Removed default chapters so users start fresh
    },
    {
      id: "chemistry",
      name: "Chemistry",
      shortName: "C",
      chapters: [],
    },
    {
      id: "maths",
      name: "Mathematics",
      shortName: "M",
      chapters: [],
    },
  ],
  activeSubject: "physics",
  sidebarOpen: false,
  currentPage: "checklist",
  targetDeadline: "2025-12-30",
  currentDate: getCurrentDate(), // Using dynamic date function
  loading: false, // No loading needed for localStorage
  userProfile: undefined, // Added userProfile to initial state
  isDarkMode: false, // Added dark mode state
}

type AppAction =
  | { type: "SET_ACTIVE_SUBJECT"; payload: string } // Changed to string to support custom subjects
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_CURRENT_PAGE"; payload: "checklist" | "analysis" | "priority" | "howto" } // Added howto page type
  | {
      type: "ADD_CHAPTER"
      payload: {
        subject: string // Changed to string to support custom subjects
        name: string
        difficulty?: "easy" | "medium" | "hard" | "none"
      }
    }
  | { type: "RENAME_CHAPTER"; payload: { chapterId: string; newName: string } }
  | { type: "DELETE_CHAPTER"; payload: { chapterId: string } }
  | { type: "SET_CHAPTER_DIFFICULTY"; payload: { chapterId: string; difficulty: "easy" | "medium" | "hard" | "none" } }
  | { type: "SET_CHAPTER_TARGET_DATE"; payload: { chapterId: string; targetDate: string } }
  | { type: "ADD_ACTIVITY"; payload: { chapterId: string; name: string } }
  | { type: "RENAME_ACTIVITY"; payload: { chapterId: string; activityId: string; newName: string } }
  | { type: "DELETE_ACTIVITY"; payload: { chapterId: string; activityId: string } }
  | { type: "TOGGLE_ACTIVITY"; payload: { chapterId: string; activityId: string } }
  | { type: "TOGGLE_ALL_ACTIVITIES"; payload: { chapterId: string; completed: boolean } } // Added action to toggle all activities in a chapter
  | { type: "SET_TARGET_DEADLINE"; payload: string }
  | { type: "LOAD_FROM_STORAGE"; payload: AppState }
  | { type: "UPDATE_CURRENT_DATE" }
  | { type: "ADD_SUBJECT"; payload: { name: string; shortName: string } } // Added custom subject actions
  | { type: "DELETE_SUBJECT"; payload: { subjectId: string } }
  | { type: "SET_USER_PROFILE"; payload: UserProfile } // Added user profile action
  | { type: "TOGGLE_DARK_MODE" } // Completely removed trailing backslash

const saveToStorage = (state: AppState) => {
  try {
    localStorage.setItem("jee-tracker-data", JSON.stringify(state))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

const loadFromStorage = (): AppState | null => {
  try {
    const saved = localStorage.getItem("jee-tracker-data")
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
    return null
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  let newState: AppState

  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return { ...action.payload, currentDate: getCurrentDate() }

    case "UPDATE_CURRENT_DATE":
      newState = { ...state, currentDate: getCurrentDate() }
      break

    case "TOGGLE_DARK_MODE": // Added dark mode toggle case
      newState = { ...state, isDarkMode: !state.isDarkMode }
      break

    case "SET_ACTIVE_SUBJECT":
      newState = { ...state, activeSubject: action.payload }
      break

    case "TOGGLE_SIDEBAR":
      newState = { ...state, sidebarOpen: !state.sidebarOpen }
      break

    case "SET_CURRENT_PAGE":
      newState = { ...state, currentPage: action.payload, sidebarOpen: false }
      break

    case "SET_TARGET_DEADLINE":
      newState = { ...state, targetDeadline: action.payload }
      break

    case "ADD_CHAPTER":
      const newChapter = {
        id: `chapter-${Date.now()}`,
        name: action.payload.name,
        subject: action.payload.subject,
        difficulty: action.payload.difficulty || "none",
        activities: [],
      }

      newState = {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.payload.subject
            ? {
                ...subject,
                chapters: [...subject.chapters, newChapter],
              }
            : subject,
        ),
      }
      break

    case "SET_CHAPTER_DIFFICULTY":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId ? { ...chapter, difficulty: action.payload.difficulty } : chapter,
          ),
        })),
      }
      break

    case "SET_CHAPTER_TARGET_DATE":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId ? { ...chapter, targetDate: action.payload.targetDate } : chapter,
          ),
        })),
      }
      break

    case "RENAME_CHAPTER":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId ? { ...chapter, name: action.payload.newName } : chapter,
          ),
        })),
      }
      break

    case "DELETE_CHAPTER":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.filter((chapter) => chapter.id !== action.payload.chapterId),
        })),
      }
      break

    case "ADD_ACTIVITY":
      const newActivity = {
        id: `activity-${Date.now()}`,
        name: action.payload.name,
        completed: false,
      }

      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId
              ? {
                  ...chapter,
                  activities: [...chapter.activities, newActivity],
                }
              : chapter,
          ),
        })),
      }
      break

    case "RENAME_ACTIVITY":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId
              ? {
                  ...chapter,
                  activities: chapter.activities.map((activity) =>
                    activity.id === action.payload.activityId
                      ? { ...activity, name: action.payload.newName }
                      : activity,
                  ),
                }
              : chapter,
          ),
        })),
      }
      break

    case "DELETE_ACTIVITY":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId
              ? {
                  ...chapter,
                  activities: chapter.activities.filter((activity) => activity.id !== action.payload.activityId),
                }
              : chapter,
          ),
        })),
      }
      break

    case "TOGGLE_ACTIVITY":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId
              ? {
                  ...chapter,
                  activities: chapter.activities.map((activity) =>
                    activity.id === action.payload.activityId
                      ? { ...activity, completed: !activity.completed }
                      : activity,
                  ),
                }
              : chapter,
          ),
        })),
      }
      break

    case "TOGGLE_ALL_ACTIVITIES":
      newState = {
        ...state,
        subjects: state.subjects.map((subject) => ({
          ...subject,
          chapters: subject.chapters.map((chapter) =>
            chapter.id === action.payload.chapterId
              ? {
                  ...chapter,
                  activities: chapter.activities.map((activity) => ({
                    ...activity,
                    completed: action.payload.completed,
                  })),
                }
              : chapter,
          ),
        })),
      }
      break

    case "ADD_SUBJECT": // Added custom subject management
      const newSubject = {
        id: `subject-${Date.now()}`,
        name: action.payload.name,
        shortName: action.payload.shortName,
        chapters: [],
      }

      newState = {
        ...state,
        subjects: [...state.subjects, newSubject],
      }
      break

    case "DELETE_SUBJECT":
      newState = {
        ...state,
        subjects: state.subjects.filter((subject) => subject.id !== action.payload.subjectId),
        activeSubject:
          state.activeSubject === action.payload.subjectId ? state.subjects[0]?.id || "physics" : state.activeSubject,
      }
      break

    case "SET_USER_PROFILE": // Added user profile case
      newState = {
        ...state,
        userProfile: action.payload,
        targetDeadline: action.payload.examDate, // Set exam date as initial target deadline
      }
      break

    default:
      return state
  }

  if (action.type !== "LOAD_FROM_STORAGE" && action.type !== "UPDATE_CURRENT_DATE") {
    saveToStorage(newState)
  }

  return newState
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const savedState = loadFromStorage()
    if (savedState) {
      dispatch({ type: "LOAD_FROM_STORAGE", payload: savedState })
    }

    const updateDate = () => {
      dispatch({ type: "UPDATE_CURRENT_DATE" })
    }

    // Update date immediately and then every hour
    const interval = setInterval(updateDate, 60 * 60 * 1000) // 1 hour

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [state.isDarkMode])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
