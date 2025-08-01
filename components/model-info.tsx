"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, RefreshCw } from "lucide-react"

interface ModelStats {
  status: string
  model: {
    trained: boolean
    type: string
    totalPrefixes: number
    totalWords: number
  }
}

export function ModelInfo() {
  const [stats, setStats] = useState<ModelStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/predict")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch model stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (!stats) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">Model Statistics</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
            className="border-indigo-200 hover:bg-indigo-50 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>Performance metrics for the n-gram language model</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.model.totalPrefixes.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Word Patterns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.model.totalWords.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Unique Words</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {stats.model.type.toUpperCase()} Model
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {stats.model.trained ? "Trained" : "Not Trained"}
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Status: {stats.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
