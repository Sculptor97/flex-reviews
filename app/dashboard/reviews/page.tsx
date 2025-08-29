"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, CheckCircle, XCircle, Clock, Search, MessageSquare } from "lucide-react"
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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [responseText, setResponseText] = useState("")

  const [filters, setFilters] = useState({
    search: "",
    rating: "",
    channel: "",
    sentiment: "",
    approved: "",
    dateRange: "all",
  })

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await ReviewService.fetchDashboardReviews()

      if (response.success) {
        setReviews(response.data.reviews)
        setFilteredReviews(response.data.reviews)
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

  // Apply filters
  useEffect(() => {
    let filtered = [...reviews]

    if (filters.search) {
      filtered = filtered.filter(
        (review) =>
          review.comment.toLowerCase().includes(filters.search.toLowerCase()) ||
          review.guestName.toLowerCase().includes(filters.search.toLowerCase()) ||
          review.propertyName.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.rating) {
      filtered = filtered.filter((review) => review.rating >= Number.parseInt(filters.rating))
    }

    if (filters.channel) {
      filtered = filtered.filter((review) => review.channel === filters.channel)
    }

    if (filters.sentiment) {
      filtered = filtered.filter((review) => review.category === filters.sentiment)
    }

    if (filters.approved !== "") {
      filtered = filtered.filter((review) => review.isApproved === (filters.approved === "true"))
    }

    setFilteredReviews(filtered)
  }, [filters, reviews])

  const handleApproval = async (reviewId: string, approved: boolean) => {
    try {
      const response = await ReviewService.approveReviews([reviewId], approved, "Admin")
      
      if (response.success) {
        // Refresh the reviews list
        fetchReviews()
      } else {
        console.error("Failed to approve review:", response.error)
      }
    } catch (error) {
      console.error("Error approving review:", error)
    }
  }

  const handleBulkApproval = async (approved: boolean) => {
    try {
      setReviews((prev) =>
        prev.map((review) => (selectedReviews.includes(review.id) ? { ...review, isApproved: approved } : review)),
      )

      const response = await ReviewService.approveReviews(selectedReviews, approved, "Manager")

      if (response.success) {
        setSelectedReviews([])
      } else {
        console.error("Failed to bulk update approval status:", response.error)
        setReviews((prev) =>
          prev.map((review) => (selectedReviews.includes(review.id) ? { ...review, isApproved: !approved } : review)),
        )
      }
    } catch (error) {
      console.error("Error bulk updating approval status:", error)
      setReviews((prev) =>
        prev.map((review) => (selectedReviews.includes(review.id) ? { ...review, isApproved: !approved } : review)),
      )
    }
  }

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]))
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-brand-teal/10 text-brand-teal"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-brand-sage text-brand-dark"
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "airbnb":
        return "bg-brand-cream text-brand-dark"
      case "booking.com":
        return "bg-brand-sage text-brand-dark"
      case "vrbo":
        return "bg-brand-teal/10 text-brand-teal"
      default:
        return "bg-brand-sage text-brand-dark"
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">Reviews ({filteredReviews.length})</h2>
            <p className="text-brand-dark/60">Manage and approve guest reviews</p>
          </div>
          {selectedReviews.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-brand-dark/60">{selectedReviews.length} selected</span>
              <Button
                size="sm"
                className="bg-brand-teal hover:bg-brand-teal/90 text-white"
                onClick={() => handleBulkApproval(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkApproval(false)}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject All
              </Button>
            </div>
          )}
        </div>

        <Card className="mb-6 bg-white border-brand-sage">
          <CardHeader>
            <CardTitle className="text-lg text-brand-dark">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="search" className="text-brand-dark">
                  Search Reviews
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-brand-dark/60" />
                  <Input
                    id="search"
                    placeholder="Search reviews..."
                    className="pl-10 bg-white border-brand-sage focus:border-brand-teal"
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label className="text-brand-dark">Minimum Rating</Label>
                <Select
                  value={filters.rating}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: value }))}
                >
                  <SelectTrigger className="bg-white border-brand-sage focus:border-brand-teal">
                    <SelectValue placeholder="All ratings" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-brand-sage">
                    <SelectItem value="all">All ratings</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="2">2+ stars</SelectItem>
                    <SelectItem value="1">1+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-brand-dark">Channel</Label>
                <Select
                  value={filters.channel}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, channel: value }))}
                >
                  <SelectTrigger className="bg-white border-brand-sage focus:border-brand-teal">
                    <SelectValue placeholder="All channels" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-brand-sage">
                    <SelectItem value="all">All channels</SelectItem>
                    <SelectItem value="Airbnb">Airbnb</SelectItem>
                    <SelectItem value="Booking.com">Booking.com</SelectItem>
                    <SelectItem value="VRBO">VRBO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-brand-dark">Sentiment</Label>
                <Select
                  value={filters.sentiment}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, sentiment: value }))}
                >
                  <SelectTrigger className="bg-white border-brand-sage focus:border-brand-teal">
                    <SelectValue placeholder="All sentiments" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-brand-sage">
                    <SelectItem value="all">All sentiments</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-brand-dark">Approval Status</Label>
                <Select
                  value={filters.approved}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, approved: value }))}
                >
                  <SelectTrigger className="bg-white border-brand-sage focus:border-brand-teal">
                    <SelectValue placeholder="All reviews" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-brand-sage">
                    <SelectItem value="all">All reviews</SelectItem>
                    <SelectItem value="true">Approved</SelectItem>
                    <SelectItem value="false">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      search: "",
                      rating: "",
                      channel: "",
                      sentiment: "",
                      approved: "",
                      dateRange: "all",
                    })
                  }
                  className="w-full bg-white border-brand-sage hover:bg-brand-sage text-brand-dark"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="w-full bg-white border-brand-sage">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedReviews.includes(review.id)}
                    onCheckedChange={() => toggleReviewSelection(review.id)}
                  />
                  <div>
                    <CardTitle className="text-lg text-brand-dark">{review.propertyName}</CardTitle>
                    <CardDescription className="text-brand-dark/60">
                      by {review.guestName} • {new Date(review.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSentimentColor(review.category)}>{review.category}</Badge>
                  <Badge className={getChannelColor(review.channel)}>{review.channel}</Badge>
                  {review.isApproved ? (
                    <Badge className="bg-brand-teal/10 text-brand-teal">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-brand-sage text-brand-dark">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-brand-teal text-brand-teal" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-brand-dark/60">{review.rating}/5</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-brand-dark mb-4">{review.comment}</p>

              {review.response && (
                <div className="bg-brand-cream p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-brand-dark mb-1">Host Response:</p>
                  <p className="text-sm text-brand-dark">{review.response}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {!review.isApproved ? (
                    <Button
                      size="sm"
                      className="bg-brand-teal hover:bg-brand-teal/90 text-white"
                      onClick={() => handleApproval(review.id, true)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-brand-sage hover:bg-brand-sage bg-transparent"
                      onClick={() => handleApproval(review.id, false)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Unapprove
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-brand-sage hover:bg-brand-sage bg-transparent"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-brand-sage">
                      <DialogHeader>
                        <DialogTitle className="text-brand-dark">Respond to Review</DialogTitle>
                        <DialogDescription className="text-brand-dark/60">
                          Write a response to {review.guestName}'s review
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="response" className="text-brand-dark">
                            Your Response
                          </Label>
                          <Textarea
                            id="response"
                            placeholder="Thank you for your feedback..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            className="bg-white border-brand-sage focus:border-brand-teal"
                          />
                        </div>
                        <Button className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white">
                          Send Response
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
