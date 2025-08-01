import { type NextRequest, NextResponse } from "next/server"

// Sample training corpus
const TRAINING_CORPUS = `
The weather is very nice today. The sun is shining brightly in the sky.
I love to read books in the morning. Reading books is a great way to learn.
The cat is sleeping on the couch. The dog is playing in the garden.
Machine learning is a fascinating field of study. Artificial intelligence will change the world.
The quick brown fox jumps over the lazy dog. This is a common sentence used for typing practice.
Python is a powerful programming language. Many developers love to use Python for data science.
The ocean is deep and mysterious. Fish swim in the deep blue sea.
Music is the universal language of mankind. People enjoy listening to music from different cultures.
The mountain peak is covered with snow. Hiking in the mountains is an adventure.
Technology has revolutionized the way we communicate. Social media connects people around the world.
The library is a quiet place to study. Students often go to the library to do research.
Cooking is both an art and a science. Good food brings people together.
The garden is full of beautiful flowers. Bees collect nectar from the colorful blooms.
Exercise is important for maintaining good health. Regular physical activity keeps the body strong.
The night sky is filled with twinkling stars. Astronomers study the mysteries of the universe.
Education is the key to success in life. Learning never stops throughout our journey.
The river flows gently through the valley. Water is essential for all forms of life.
Art expresses the creativity of the human spirit. Museums preserve cultural heritage for future generations.
The forest is home to many wild animals. Trees provide oxygen and clean the air we breathe.
Friendship is one of life's greatest treasures. True friends support each other through good times and bad.
The morning sun rises over the horizon. Dawn brings new opportunities and fresh beginnings.
Science helps us understand the natural world. Research and discovery drive human progress forward.
The city streets are busy with traffic. Urban life moves at a fast pace every day.
Children love to play games and have fun. Laughter and joy are important parts of childhood.
The beach is a perfect place to relax. Waves crash gently against the sandy shore below.
Learning new skills takes time and practice. Patience and persistence lead to mastery and success.
The coffee shop is crowded in the morning. People enjoy their daily dose of caffeine before work.
Books open doors to new worlds and ideas. Reading expands the mind and enriches the soul within.
The park is filled with families enjoying picnics. Children run and play while parents watch nearby.
Music has the power to heal and inspire. Melodies can transport us to different times and places.
`

interface NGramModel {
  [key: string]: { [word: string]: number }
}

class NextWordPredictor {
  private model: NGramModel = {}
  private trained = false

  constructor() {
    this.trainModel()
  }

  private cleanText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  private trainModel(): void {
    const sentences = TRAINING_CORPUS.split(".")

    for (const sentence of sentences) {
      if (!sentence.trim()) continue

      const cleanSentence = this.cleanText(sentence)
      const tokens = ["<start>", ...cleanSentence.split(" "), "<end>"]

      // Create trigrams (3-grams)
      for (let i = 0; i < tokens.length - 2; i++) {
        const prefix = `${tokens[i]} ${tokens[i + 1]}`
        const nextWord = tokens[i + 2]

        if (!this.model[prefix]) {
          this.model[prefix] = {}
        }

        if (!this.model[prefix][nextWord]) {
          this.model[prefix][nextWord] = 0
        }

        this.model[prefix][nextWord]++
      }
    }

    this.trained = true
  }

  private getMostLikelyWord(prefix: string): string {
    if (!this.model[prefix]) {
      return "unknown"
    }

    let maxCount = 0
    let bestWord = "unknown"

    for (const [word, count] of Object.entries(this.model[prefix])) {
      if (count > maxCount) {
        maxCount = count
        bestWord = word
      }
    }

    return bestWord === "<end>" ? "unknown" : bestWord
  }

  predict(sentence: string): { word: string; confidence: number } {
    if (!this.trained) {
      return { word: "unknown", confidence: 0.1 }
    }

    const cleanSentence = this.cleanText(sentence)
    const tokens = cleanSentence.split(" ").filter((token) => token.length > 0)

    if (tokens.length === 0) {
      return { word: "the", confidence: 0.5 }
    }

    if (tokens.length === 1) {
      // Try to find any bigram starting with this word
      const prefix = `<start> ${tokens[0]}`
      const prediction = this.getMostLikelyWord(prefix)

      if (prediction !== "unknown") {
        return { word: prediction, confidence: 0.7 }
      }

      // Fallback: look for any prefix containing this word
      for (const modelPrefix of Object.keys(this.model)) {
        if (modelPrefix.includes(tokens[0])) {
          const prediction = this.getMostLikelyWord(modelPrefix)
          if (prediction !== "unknown") {
            return { word: prediction, confidence: 0.5 }
          }
        }
      }
    } else {
      // Use last two words as prefix
      const prefix = `${tokens[tokens.length - 2]} ${tokens[tokens.length - 1]}`
      const prediction = this.getMostLikelyWord(prefix)

      if (prediction !== "unknown") {
        return { word: prediction, confidence: 0.8 }
      }

      // Fallback: try with just the last word
      const lastWord = tokens[tokens.length - 1]
      for (const modelPrefix of Object.keys(this.model)) {
        if (modelPrefix.endsWith(` ${lastWord}`)) {
          const prediction = this.getMostLikelyWord(modelPrefix)
          if (prediction !== "unknown") {
            return { word: prediction, confidence: 0.6 }
          }
        }
      }
    }

    // Final fallback: return a common word based on context
    const commonWords = [
      "the",
      "and",
      "to",
      "a",
      "of",
      "in",
      "is",
      "it",
      "you",
      "that",
      "for",
      "on",
      "with",
      "as",
      "be",
      "at",
      "by",
      "this",
      "have",
      "from",
    ]
    const randomIndex = Math.abs(sentence.length) % commonWords.length
    return { word: commonWords[randomIndex], confidence: 0.3 }
  }

  getModelStats(): { totalPrefixes: number; totalWords: number } {
    const totalPrefixes = Object.keys(this.model).length
    let totalWords = 0

    for (const words of Object.values(this.model)) {
      totalWords += Object.keys(words).length
    }

    return { totalPrefixes, totalWords }
  }
}

// Create a singleton instance
const predictor = new NextWordPredictor()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sentence } = body

    if (!sentence || typeof sentence !== "string") {
      return NextResponse.json({ error: "Sentence is required and must be a string" }, { status: 400 })
    }

    if (sentence.trim().length === 0) {
      return NextResponse.json({ error: "Sentence cannot be empty" }, { status: 400 })
    }

    const prediction = predictor.predict(sentence.trim())

    return NextResponse.json({
      word: prediction.word,
      confidence: prediction.confidence,
      input: sentence.trim(),
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  const stats = predictor.getModelStats()

  return NextResponse.json({
    status: "healthy",
    message: "Next Word Predictor API",
    model: {
      trained: true,
      type: "trigram",
      ...stats,
    },
    endpoints: {
      predict: "POST /api/predict",
    },
  })
}
