"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface Review {
  id: string
  propertyId: string
  propertyName: string
  guestName: string
  rating: number
  comment: string
  date: string
  channel: string
  categories: {
    cleanliness: number
    communication: number
    checkIn: number
    accuracy: number
    location: number
    value: number
  }
  hostResponse?: string
  verified: boolean
  approved: boolean
  sentiment: "positive" | "neutral" | "negative"
}

interface ApiResponse {
  success: boolean
  data: {
    reviews: Review[]
    summary: {
      totalReviews: number
      averageRating: number
      channelBreakdown: Record<string, number>
      sentimentBreakdown: {
        positive: number
        neutral: number
        negative: number
      }
    }
  }
}

export default function AnalyticsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/reviews/hostaway")
      const data: ApiResponse = await response.json()

      if (data.success) {
        setReviews(data.data.reviews)
        setSummary(data.data.summary)
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const channelData = Object.entries(summary?.channelBreakdown || {}).map(([channel, count]) => ({
    channel,
    count,
  }))

  const sentimentData = [
    { name: "Positive", value: summary?.sentimentBreakdown?.positive || 0, color: "#284e4c" },
    { name: "Neutral", value: summary?.sentimentBreakdown?.neutral || 0, color: "#f1f3ee" },
    { name: "Negative", value: summary?.sentimentBreakdown?.negative || 0, color: "#111827" },
  ]

  const ratingTrendData = reviews
    .reduce((acc: any[], review) => {
      const month = new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      const existing = acc.find((item) => item.month === month)
      if (existing) {
        existing.totalRating += review.rating
        existing.count += 1
        existing.avgRating = existing.totalRating / existing.count
      } else {
        acc.push({ month, totalRating: review.rating, count: 1, avgRating: review.rating })
      }
      return acc
    }, [])
    .slice(-6)

  const volumeTrendData = reviews
    .reduce((acc: any[], review) => {
      const month = new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      const existing = acc.find((item) => item.month === month)
      if (existing) {
        existing.reviews += 1
      } else {
        acc.push({ month, reviews: 1 })
      }
      return acc
    }, [])
    .slice(-6)

  const categoryRadarData = [
    { category: "Cleanliness", value: reviews.reduce((sum, r) => sum + r.categories.cleanliness, 0) / reviews.length },
    {
      category: "Communication",
      value: reviews.reduce((sum, r) => sum + r.categories.communication, 0) / reviews.length,
    },
    { category: "Check-in", value: reviews.reduce((sum, r) => sum + r.categories.checkIn, 0) / reviews.length },
    { category: "Accuracy", value: reviews.reduce((sum, r) => sum + r.categories.accuracy, 0) / reviews.length },
    { category: "Location", value: reviews.reduce((sum, r) => sum + r.categories.location, 0) / reviews.length },
    { category: "Value", value: reviews.reduce((sum, r) => sum + r.categories.value, 0) / reviews.length },
  ]

  const approvalData = [
    { name: "Approved", value: reviews.filter((r) => r.approved).length, color: "#284e4c" },
    { name: "Pending", value: reviews.filter((r) => !r.approved).length, color: "#f1f3ee" },
  ]

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-dark">Analytics</h2>
        <p className="text-brand-dark/60">Detailed insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-brand-dark">Channel Performance</CardTitle>
            <CardDescription className="text-brand-dark/60">Reviews by booking platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3ee" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#284e4c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-brand-dark">Sentiment Analysis</CardTitle>
            <CardDescription className="text-brand-dark/60">Review sentiment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-brand-dark">Rating Trends</CardTitle>
            <CardDescription className="text-brand-dark/60">Average rating over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ratingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3ee" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgRating" stroke="#284e4c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-brand-dark">Review Volume</CardTitle>
            <CardDescription className="text-brand-dark/60">Number of reviews over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={volumeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3ee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="reviews" stroke="#284e4c" fill="#284e4c" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-brand-dark">Category Performance</CardTitle>
            <CardDescription className="text-brand-dark/60">Average ratings by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={categoryRadarData}>
                <PolarGrid stroke="#f1f3ee" />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis domain={[0, 5]} />
                <Radar name="Rating" dataKey="value" stroke="#284e4c" fill="#284e4c" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-brand-dark">Approval Status</CardTitle>
            <CardDescription className="text-brand-dark/60">Review approval breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={approvalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {approvalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
