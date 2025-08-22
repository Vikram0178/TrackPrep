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
  lastRevisedDate?: string // Added revision tracking field
  scheduledRevisionDate?: string // Added revision scheduling fields
  notificationEnabled?: boolean // Added revision scheduling fields
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

export interface TestSubject {
  name: string
  correct: number
  incorrect: number
  unattempted: number
  marks: number
}

export interface Test {
  id: string
  name: string
  dateAttempted: string
  totalQuestions: number
  correct: number
  incorrect: number
  unattempted: number
  totalTime: string
  totalMarks: number
  subjects: TestSubject[]
  createdAt: string
}

export interface AppState {
  subjects: Subject[]
  activeSubject: string
  sidebarOpen: boolean
  currentPage: "checklist" | "analysis" | "priority" | "howto" | "revision" | "test" | "testanalysis" | "databackup" // Added databackup page type
  targetDeadline: string
  currentDate: string
  loading: boolean
  userProfile?: UserProfile
  tests?: Test[] // Added tests array to store test data
}

export type AppAction =
  | { type: "ADD_CHAPTER"; payload: { subject: string; chapter: Chapter } }
  | { type: "DELETE_CHAPTER"; payload: { subject: string; chapterId: string } }
  | { type: "RENAME_CHAPTER"; payload: { subject: string; chapterId: string; newName: string } }
  | { type: "ADD_ACTIVITY"; payload: { subject: string; chapterId: string; activity: Activity } }
  | { type: "DELETE_ACTIVITY"; payload: { subject: string; chapterId: string; activityId: string } }
  | { type: "RENAME_ACTIVITY"; payload: { subject: string; chapterId: string; activityId: string; newName: string } }
  | { type: "TOGGLE_ACTIVITY"; payload: { subject: string; chapterId: string; activityId: string } }
  | { type: "TOGGLE_ALL_ACTIVITIES"; payload: { subject: string; chapterId: string; completed: boolean } }
  | { type: "SET_ACTIVE_SUBJECT"; payload: string }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_CURRENT_PAGE"; payload: AppState["currentPage"] }
  | { type: "SET_TARGET_DEADLINE"; payload: string }
  | { type: "UPDATE_CURRENT_DATE" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER_PROFILE"; payload: UserProfile }
  | { type: "ADD_SUBJECT"; payload: Subject }
  | { type: "DELETE_SUBJECT"; payload: string }
  | { type: "MARK_CHAPTER_REVISED"; payload: { chapterId: string } }
  | { type: "ADD_TEST"; payload: Test }
  | { type: "EDIT_TEST"; payload: { testId: string; testData: Test } }
  | { type: "DELETE_TEST"; payload: { testId: string } }
  | { type: "IMPORT_DATA"; payload: AppState }
  | { type: "SCHEDULE_REVISION"; payload: { chapterId: string; date: string; enableNotification: boolean } } // Added revision scheduling actions
  | { type: "CANCEL_REVISION_SCHEDULE"; payload: { chapterId: string } } // Added revision scheduling actions
