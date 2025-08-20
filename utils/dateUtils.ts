export const formatDate = (date: Date): string => {
  const day = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.getFullYear().toString().slice(-2)

  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th"

  return `${day}${suffix} ${month}, ${year}`
}

export const getCurrentDate = (): string => {
  return formatDate(new Date())
}

export const calculateDaysUntil = (targetDate: string): number => {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

export const calculateDaysLeft = calculateDaysUntil
