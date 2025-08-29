import type { Review } from "@/types/review"

export function calculateRatingTrends(reviews: Review[], months = 6) {
  return reviews
    .reduce((acc: any[], review) => {
      const month = new Date(review.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      const existing = acc.find((item) => item.month === month)
      if (existing) {
        existing.totalRating += review.rating
        existing.count += 1
        existing.avgRating = Number((existing.totalRating / existing.count).toFixed(1))
      } else {
        acc.push({ month, totalRating: review.rating, count: 1, avgRating: review.rating })
      }
      return acc
    }, [])
    .slice(-months)
}

export function calculateVolumeTrends(reviews: Review[], months = 6) {
  return reviews
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
    .slice(-months)
}

export function calculateCategoryPerformance(reviews: Review[]) {
  if (reviews.length === 0) return []

  return [
    {
      category: "Cleanliness",
      value: Number((reviews.reduce((sum, r) => sum + r.categories.cleanliness, 0) / reviews.length).toFixed(1)),
    },
    {
      category: "Communication",
      value: Number((reviews.reduce((sum, r) => sum + r.categories.communication, 0) / reviews.length).toFixed(1)),
    },
    {
      category: "Check-in",
      value: Number((reviews.reduce((sum, r) => sum + r.categories.checkIn, 0) / reviews.length).toFixed(1)),
    },
    {
      category: "Accuracy",
      value: Number((reviews.reduce((sum, r) => sum + r.categories.accuracy, 0) / reviews.length).toFixed(1)),
    },
    {
      category: "Location",
      value: Number((reviews.reduce((sum, r) => sum + r.categories.location, 0) / reviews.length).toFixed(1)),
    },
    {
      category: "Value",
      value: Number((reviews.reduce((sum, r) => sum + r.categories.value, 0) / reviews.length).toFixed(1)),
    },
  ]
}

export function prepareChartData(reviews: Review[]) {
  const stats = calculateReviewStats(reviews)

  const sentimentData = [
    { name: "Positive", value: stats.sentimentBreakdown.positive, color: "#284e4c" },
    { name: "Neutral", value: stats.sentimentBreakdown.neutral, color: "#f1f3ee" },
    { name: "Negative", value: stats.sentimentBreakdown.negative, color: "#111827" },
  ]

  const channelData = Object.entries(stats.channelBreakdown).map(([channel, count]) => ({
    channel,
    count,
  }))

  const approvalData = [
    { name: "Approved", value: stats.approvedCount, color: "#284e4c" },
    { name: "Pending", value: stats.pendingCount, color: "#f1f3ee" },
  ]

  return {
    sentimentData,
    channelData,
    approvalData,
    ratingDistribution: stats.ratingDistribution,
    ratingTrends: calculateRatingTrends(reviews),
    volumeTrends: calculateVolumeTrends(reviews),
    categoryPerformance: calculateCategoryPerformance(reviews),
  }
}

// Helper function to calculate review stats (moved from reviewUtils to avoid circular dependency)
function calculateReviewStats(reviews: Review[]) {
  if (reviews.length === 0) {
    return {
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

  const approvedCount = reviews.filter((r) => r.approved).length
  const pendingCount = reviews.length - approvedCount

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
    approvedCount,
    pendingCount,
    sentimentBreakdown,
    channelBreakdown,
    ratingDistribution,
  }
}
