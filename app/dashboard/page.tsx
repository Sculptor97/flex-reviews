"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, TrendingUp, MessageSquare, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
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

export default function DashboardOverview() {
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

  // Chart data
  const ratingDistribution = [
    { rating: "5 Stars", count: summary?.ratingBreakdown?.[5] || 0 },
    { rating: "4 Stars", count: summary?.ratingBreakdown?.[4] || 0 },
    { rating: "3 Stars", count: summary?.ratingBreakdown?.[3] || 0 },
    { rating: "2 Stars", count: summary?.ratingBreakdown?.[2] || 0 },
    { rating: "1 Star", count: summary?.ratingBreakdown?.[1] || 0 },
  ]

  const sentimentData = [
    { name: "Positive", value: summary?.sentimentBreakdown?.positive || 0, color: "#284e4c" },
    { name: "Neutral", value: summary?.sentimentBreakdown?.neutral || 0, color: "#f1f3ee" },
    { name: "Negative", value: summary?.sentimentBreakdown?.negative || 0, color: "#111827" },
  ]

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-brand-sage">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-dark">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-brand-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-dark">{summary.totalReviews}</div>
              <p className="text-xs text-brand-dark/60">Across all properties</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-brand-sage">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-dark">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-brand-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-dark">{summary.averageRating}/5</div>
              <p className="text-xs text-brand-dark/60">Across all properties</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-brand-sage">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-dark">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-brand-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-dark">{summary.approvalBreakdown.approved}</div>
              <p className="text-xs text-brand-dark/60">{summary.approvalBreakdown.pending} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-brand-sage">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-dark">Positive Reviews</CardTitle>
              <TrendingUp className="h-4 w-4 text-brand-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-dark">{summary.sentimentBreakdown.positive}</div>
              <p className="text-xs text-brand-dark/60">
                {Math.round((summary.sentimentBreakdown.positive / summary.totalReviews) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-brand-dark">Rating Distribution</CardTitle>
            <CardDescription className="text-brand-dark/60">Overview of guest ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3ee" />
                <XAxis dataKey="rating" />
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
            <CardDescription className="text-brand-dark/60">Guest feedback sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {sentimentData.map((entry, index) => (
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
