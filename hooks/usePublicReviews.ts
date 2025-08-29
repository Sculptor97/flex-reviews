"use client"

import { useState, useEffect } from "react"
import { ReviewService } from "@/services/reviewService"
import type { Review } from "@/services/reviewService"

export function usePublicReviews(params?: {
  rating?: string
  category?: string
  channel?: string
  sortBy?: string
  sortOrder?: string
  limit?: string
  page?: string
}) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await ReviewService.fetchPublicReviews(params)

      if (response.success) {
        setReviews(response.data.reviews)
        setPagination(response.data.pagination)
      } else {
        setError(response.error || "Failed to fetch reviews")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [JSON.stringify(params)]) // Re-fetch when params change

  const refetch = () => {
    fetchReviews()
  }

  return {
    reviews,
    pagination,
    loading,
    error,
    refetch,
  }
}
