"use client"

import { useState, useEffect } from "react"
import { ReviewService } from "@/services/reviewService"
import type { Review } from "@/types/review"

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await ReviewService.fetchHostawayReviews()

      if (response.success) {
        setReviews(response.data.reviews)
        setSummary(response.data.summary)
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
  }, [])

  const refetch = () => {
    fetchReviews()
  }

  return {
    reviews,
    summary,
    loading,
    error,
    refetch,
  }
}
