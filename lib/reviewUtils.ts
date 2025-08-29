import type { Review } from "@/types/review"

export interface ReviewFilters {
  search: string
  rating: string
  channel: string
  sentiment: string
  approved: string
  dateRange: string
  property?: string
  sortBy?: string
}

export function filterReviews(reviews: Review[], filters: ReviewFilters): Review[] {
  let filtered = [...reviews]

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (review) =>
        review.comment.toLowerCase().includes(searchLower) ||
        review.guestName.toLowerCase().includes(searchLower) ||
        review.propertyName.toLowerCase().includes(searchLower),
    )
  }

  if (filters.rating && filters.rating !== "all") {
    filtered = filtered.filter((review) => review.rating >= Number.parseInt(filters.rating))
  }

  if (filters.channel && filters.channel !== "all") {
    filtered = filtered.filter((review) => review.channel === filters.channel)
  }

  if (filters.sentiment && filters.sentiment !== "all") {
    filtered = filtered.filter((review) => review.sentiment === filters.sentiment)
  }

  if (filters.approved !== "" && filters.approved !== "all") {
    filtered = filtered.filter((review) => review.approved === (filters.approved === "true"))
  }

  if (filters.property && filters.property !== "all") {
    filtered = filtered.filter((review) => review.propertyName === filters.property)
  }

  return filtered
}

export function sortReviews(reviews: Review[], sortBy: string): Review[] {
  const sorted = [...reviews]

  switch (sortBy) {
    case "recent":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "oldest":
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    default:
      return sorted
  }
}

export function calculateReviewStats(reviews: Review[]) {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      approvedCount: 0,
      pendingCount: 0,
      sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
      channelBreakdown: {},
      ratingDistribution: Array.from({ length: 5 }, (_, i) => ({
        rating: `${5 - i} Star${5 - i !== 1 ? "s" : ""}`,
        count: 0,
      })),
    }
  }

  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
  const approvedCount = reviews.filter((r) => r.approved).length
  const pendingCount = totalReviews - approvedCount

  const sentimentBreakdown = reviews.reduce(
    (acc, review) => {
      acc[review.sentiment]++
      return acc
    },
    { positive: 0, neutral: 0, negative: 0 },
  )

  const channelBreakdown = reviews.reduce((acc: Record<string, number>, review) => {
    acc[review.channel] = (acc[review.channel] || 0) + 1
    return acc
  }, {})

  const ratingDistribution = [
    { rating: "5 Stars", count: reviews.filter((r) => r.rating === 5).length },
    { rating: "4 Stars", count: reviews.filter((r) => r.rating === 4).length },
    { rating: "3 Stars", count: reviews.filter((r) => r.rating === 3).length },
    { rating: "2 Stars", count: reviews.filter((r) => r.rating === 2).length },
    { rating: "1 Star", count: reviews.filter((r) => r.rating === 1).length },
  ]

  return {
    totalReviews,
    averageRating,
    approvedCount,
    pendingCount,
    sentimentBreakdown,
    channelBreakdown,
    ratingDistribution,
  }
}

export function truncateText(text: string, maxLength = 150): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "positive":
      return "bg-brand-teal/10 text-brand-teal"
    case "negative":
      return "bg-red-100 text-red-800"
    default:
      return "bg-brand-sage text-brand-dark"
  }
}

export function getChannelColor(channel: string): string {
  switch (channel.toLowerCase()) {
    case "airbnb":
      return "bg-brand-cream text-brand-dark"
    case "booking.com":
      return "bg-brand-sage text-brand-dark"
    case "vrbo":
      return "bg-brand-teal/10 text-brand-teal"
    case "google":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-brand-sage text-brand-dark"
  }
}
