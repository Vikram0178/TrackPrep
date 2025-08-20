export const greetings = [
  "Welcome back, {name}! Ready to conquer your studies? 🚀",
  "Hello {name}! Let's make today productive! ✨",
  "Hey {name}! Time to ace those chapters! 💪",
  "Good to see you again, {name}! Let's study smart! 🎯",
  "Hi {name}! Your success journey continues! 🌟",
  "Welcome {name}! Every study session counts! 📚",
  "Hello there, {name}! Let's crush those goals! 🔥",
  "Hey {name}! Ready for another productive session? ⚡",
  "Good day, {name}! Your dedication is inspiring! 🌈",
  "Welcome back, {name}! Excellence awaits! 🏆",
]

export const getDynamicGreeting = (name: string): string => {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24),
  )
  const greetingIndex = dayOfYear % greetings.length
  return greetings[greetingIndex].replace("{name}", name)
}
