export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface ReviewsData {
  reviews: any[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
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

export interface Review {
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

export class ReviewService {
  // Fetch all reviews with optional filtering
  static async fetchReviews(params?: {
    rating?: string
    category?: string
    channel?: string
    source?: string
    approved?: string
    propertyId?: string
    sortBy?: string
    sortOrder?: string
    limit?: string
    page?: string
    summary?: boolean
  }): Promise<ApiResponse<ReviewsData>> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, value.toString())
        })
      }

      const response = await fetch(`/api/reviews/hostaway?${searchParams.toString()}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      return {
        success: false,
        data: {
          reviews: [],
        },
        error: "Failed to fetch reviews",
      }
    }
  }

  // Fetch dashboard reviews (all reviews for admin view with summary)
  static async fetchDashboardReviews(params?: {
    rating?: string
    category?: string
    channel?: string
    approved?: string
    sortBy?: string
    sortOrder?: string
    limit?: string
    page?: string
  }): Promise<ApiResponse<ReviewsData>> {
    return this.fetchReviews({
      ...params,
      summary: true, // Always include summary for dashboard
    })
  }

  // Fetch public reviews (only approved reviews)
  static async fetchPublicReviews(params?: {
    rating?: string
    category?: string
    channel?: string
    sortBy?: string
    sortOrder?: string
    limit?: string
    page?: string
  }): Promise<ApiResponse<ReviewsData>> {
    return this.fetchReviews({
      ...params,
      approved: "true", // Only approved reviews
    })
  }

  // Approve/unapprove reviews
  static async approveReviews(reviewIds: string[], approved: boolean, approvedBy?: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch("/api/reviews/hostaway", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewIds,
          approved,
          approvedBy,
        }),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to approve reviews:", error)
      return {
        success: false,
        data: null,
        error: "Failed to approve reviews",
      }
    }
  }

  // Create new review
  static async createReview(reviewData: Partial<Review>): Promise<ApiResponse<any>> {
    try {
      const response = await fetch("/api/reviews/hostaway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to create review:", error)
      return {
        success: false,
        data: null,
        error: "Failed to create review",
      }
    }
  }

  // Delete review
  static async deleteReview(reviewId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/reviews/hostaway?id=${reviewId}`, {
        method: "DELETE",
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to delete review:", error)
      return {
        success: false,
        data: null,
        error: "Failed to delete review",
      }
    }
  }

  // Sync data from Hostaway
  static async syncData(): Promise<void> {
    try {
      console.log("Syncing data from Hostaway...")
      await fetch("/api/reviews/hostaway?sync=true")
      console.log("Data sync completed")
    } catch (error) {
      console.error("Failed to sync data:", error)
    }
  }

  // Legacy methods for backward compatibility
  static async fetchHostawayReviews(): Promise<ApiResponse<ReviewsData>> {
    return this.fetchReviews({ source: "hostaway" })
  }

  static async fetchGoogleReviews(placeId: string, propertyName: string): Promise<ApiResponse<ReviewsData>> {
    // This would need to be implemented if you want to keep Google integration
    // For now, return empty data
    return {
      success: false,
      data: {
        reviews: [],
      },
      error: "Google reviews integration not implemented",
    }
  }

  static async fetchCombinedReviews(includeGoogle = false, placeId?: string): Promise<ApiResponse<ReviewsData>> {
    // For combined reviews, just return all reviews from all sources
    return this.fetchReviews()
  }
}
