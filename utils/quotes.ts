export const motivationQuotes = [
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only impossible journey is the one you never begin.",
  "Success is walking from failure to failure with no loss of enthusiasm.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Believe you can and you're halfway there.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you've ever wanted is on the other side of fear.",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
  "The way to get started is to quit talking and begin doing.",
  "Innovation distinguishes between a leader and a follower.",
  "Life is what happens to you while you're busy making other plans.",
  "The future belongs to those who prepare for it today.",
  "Don't be afraid to give up the good to go for the great.",
  "The only way to do great work is to love what you do.",
  "If you are not willing to risk the usual, you will have to settle for the ordinary.",
  "Trust yourself. You know more than you think you do.",
  "All our dreams can come true if we have the courage to pursue them.",
  "The secret of getting ahead is getting started.",
  "Don't let yesterday take up too much of today.",
  "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
  "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
  "Experience is a hard teacher because she gives the test first, the lesson afterwards.",
  "To know how much there is to know is the beginning of learning to live.",
  "I find that the harder I work, the more luck I seem to have.",
  "The expert in anything was once a beginner.",
  "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The difference between ordinary and extraordinary is that little extra.",
  "Champions are made when nobody is watching.",
]

export const getDailyQuote = (): string => {
  const now = new Date()
  const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60))
  const quoteIndex = hoursSinceEpoch % motivationQuotes.length
  return motivationQuotes[quoteIndex]
}
