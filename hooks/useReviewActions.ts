"use client"

import { useState, useCallback } from "react"
import type { Review } from "@/types/review"

export function useReviewActions(reviews: Review[], setReviews: (reviews: Review[]) => void) {
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])

  const handleApproval = useCallback(
    (reviewId: string, approved: boolean) => {
      setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, approved } : review)))
    },
    [reviews, setReviews],
  )

  const handleBulkApproval = useCallback(
    (approved: boolean) => {
      setReviews(reviews.map((review) => (selectedReviews.includes(review.id) ? { ...review, approved } : review)))
      setSelectedReviews([])
    },
    [reviews, setReviews, selectedReviews],
  )

  const toggleReviewSelection = useCallback((reviewId: string) => {
    setSelectedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedReviews([])
  }, [])

  return {
    selectedReviews,
    handleApproval,
    handleBulkApproval,
    toggleReviewSelection,
    clearSelection,
  }
}
