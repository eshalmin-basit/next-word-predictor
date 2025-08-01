"use client"

import type React from "react"
import { ModelInfo } from "@/components/model-info"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, Sparkles } from "lucide-react"

export default function NextWordPredictor() {
  const [sentence, setSentence] = useState("")
  const [prediction, setPrediction] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const predictNextWord = async () => {
    if (!sentence.trim()) {
      setError("Please enter a sentence")
      return
    }

    setIsLoading(true)
    setError("")
    setPrediction("")

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: sentence.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction")
      }

      const data = await response.json()
      setPrediction(data.word)
    } catch (err) {
      setError("Failed to get prediction. Please try again.")
      console.error("Prediction error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      predictNextWord()
    }
  }

  const clearAll = () => {
    setSentence("")
    setPrediction("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Next Word Predictor
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Enter a sentence and let our custom-trained language model predict the next word using n-gram analysis.
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI-Powered Text Prediction
            </CardTitle>
            <CardDescription>Type a sentence and click predict to see what word comes next</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your sentence here... (e.g., 'The weather is very')"
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg py-6 pr-24 border-2 border-purple-100 focus:border-purple-300 rounded-xl"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                  {sentence && (
                    <Button variant="ghost" size="sm" onClick={clearAll} className="text-gray-400 hover:text-gray-600">
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Button
                onClick={predictNextWord}
                disabled={isLoading || !sentence.trim()}
                className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Predict Next Word
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            {prediction && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Prediction Result:</h3>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">
                    {"'"}
                    {sentence}
                    {"'"}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-3 py-1">
                    {prediction}
                  </Badge>
                </div>
              </div>
            )}

            {/* Error Section */}
            {error && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Info Section */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">How it works:</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Uses a custom-trained n-gram language model</li>
                <li>• Analyzes patterns in text to predict the most likely next word</li>
                <li>• Trained on a corpus of English text for better accuracy</li>
                <li>• Backend powered by FastAPI and Python ML libraries</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Model Info Section */}
        <div className="mt-8">
          <ModelInfo />
        </div>
      </div>
    </div>
  )
}
