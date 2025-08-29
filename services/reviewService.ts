export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface ReviewsData {
  reviews: any[]
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

export class ReviewService {
  static async fetchHostawayReviews(): Promise<ApiResponse<ReviewsData>> {
    try {
      const response = await fetch("/api/reviews/hostaway")
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to fetch Hostaway reviews:", error)
      return {
        success: false,
        data: {
          reviews: [],
          summary: {
            totalReviews: 0,
            averageRating: 0,
            channelBreakdown: {},
            sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
          },
        },
        error: "Failed to fetch reviews",
      }
    }
  }

  static async fetchGoogleReviews(placeId: string, propertyName: string): Promise<ApiResponse<ReviewsData>> {
    try {
      const response = await fetch(`/api/reviews/google?place_id=${placeId}&property_name=${propertyName}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to fetch Google reviews:", error)
      return {
        success: false,
        data: {
          reviews: [],
          summary: {
            totalReviews: 0,
            averageRating: 0,
            channelBreakdown: {},
            sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
          },
        },
        error: "Failed to fetch Google reviews",
      }
    }
  }

  static async fetchCombinedReviews(includeGoogle = false, placeId?: string): Promise<ApiResponse<ReviewsData>> {
    try {
      const params = new URLSearchParams()
      if (includeGoogle) params.append("include_google", "true")
      if (placeId) params.append("place_id", placeId)

      const response = await fetch(`/api/reviews/combined?${params.toString()}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to fetch combined reviews:", error)
      return {
        success: false,
        data: {
          reviews: [],
          summary: {
            totalReviews: 0,
            averageRating: 0,
            channelBreakdown: {},
            sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
          },
        },
        error: "Failed to fetch combined reviews",
      }
    }
  }
}
