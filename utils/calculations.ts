export function calculateChapterProgress(activities: { completed: boolean }[]): number {
  if (activities.length === 0) return 0
  const completed = activities.filter((activity) => activity.completed).length
  return Math.round((completed / activities.length) * 100)
}

export function calculateSubjectProgress(chapters: { activities: { completed: boolean }[] }[]): number {
  if (chapters.length === 0) return 0

  const totalActivities = chapters.reduce((sum, chapter) => sum + chapter.activities.length, 0)
  if (totalActivities === 0) return 0

  const completedActivities = chapters.reduce(
    (sum, chapter) => sum + chapter.activities.filter((activity) => activity.completed).length,
    0,
  )

  return Math.round((completedActivities / totalActivities) * 100)
}

export function calculateOverallProgress(subjects: { chapters: { activities: { completed: boolean }[] }[] }[]): number {
  const totalActivities = subjects.reduce(
    (sum, subject) => sum + subject.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.activities.length, 0),
    0,
  )

  if (totalActivities === 0) return 0

  const completedActivities = subjects.reduce(
    (sum, subject) =>
      sum +
      subject.chapters.reduce(
        (chapterSum, chapter) => chapterSum + chapter.activities.filter((activity) => activity.completed).length,
        0,
      ),
    0,
  )

  return Math.round((completedActivities / totalActivities) * 100)
}

export function getDetailedProgressStats(
  subjects: {
    id: string
    name: string
    chapters: { activities: { completed: boolean }[] }[]
  }[],
) {
  return subjects.map((subject) => {
    const progress = calculateSubjectProgress(subject.chapters)
    const totalChapters = subject.chapters.length
    const completedChapters = subject.chapters.filter(
      (chapter) => chapter.activities.length > 0 && chapter.activities.every((activity) => activity.completed),
    ).length
    const totalActivities = subject.chapters.reduce((sum, chapter) => sum + chapter.activities.length, 0)
    const completedActivities = subject.chapters.reduce(
      (sum, chapter) => sum + chapter.activities.filter((activity) => activity.completed).length,
      0,
    )

    return {
      ...subject,
      progress,
      totalChapters,
      completedChapters,
      totalActivities,
      completedActivities,
    }
  })
}
