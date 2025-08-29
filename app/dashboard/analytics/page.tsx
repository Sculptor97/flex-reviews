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

import { ReviewService } from "@/services/reviewService"

interface Review {
  id: string
  propertyId: string
  propertyName: string
  guestName: string
  guestAvatar?: string
  rating: number
  comment: string
  date: string
  channel: string
  source: string
  category: string
  isApproved: boolean
  approvedBy?: string
  approvedAt?: string
  response?: string
  responseDate?: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data: {
    reviews: Review[]
    summary?: {
      totalReviews: number
      averageRating: number
      channelBreakdown: Record<string, number>
      sentimentBreakdown: {
        positive: number
        neutral: number
        negative: number
      }
      ratingBreakdown: Record<number, number>
      approvalBreakdown: {
        approved: number
        pending: number
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
      const response = await ReviewService.fetchDashboardReviews()

      if (response.success) {
        setReviews(response.data.reviews)
        setSummary(response.data.summary)
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

  // Since we don't have categories in the new structure, we'll create a simple property performance chart
  const propertyPerformanceData = reviews
    .reduce((acc: any[], review) => {
      const existing = acc.find((item) => item.property === review.propertyName)
      if (existing) {
        existing.totalRating += review.rating
        existing.count += 1
        existing.avgRating = existing.totalRating / existing.count
      } else {
        acc.push({ property: review.propertyName, totalRating: review.rating, count: 1, avgRating: review.rating })
      }
      return acc
    }, [])
    .slice(0, 6) // Top 6 properties

  const approvalData = [
    { name: "Approved", value: summary?.approvalBreakdown?.approved || 0, color: "#284e4c" },
    { name: "Pending", value: summary?.approvalBreakdown?.pending || 0, color: "#f1f3ee" },
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
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
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
            <CardTitle className="text-brand-dark">Property Performance</CardTitle>
            <CardDescription className="text-brand-dark/60">Average ratings by property</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3ee" />
                <XAxis dataKey="property" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="avgRating" fill="#284e4c" />
              </BarChart>
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
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
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
