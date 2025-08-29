"use client"

import { useState, useMemo } from "react"
import { filterReviews, sortReviews, type ReviewFilters } from "@/lib/reviewUtils"
import type { Review } from "@/types/review"

export function useFilteredReviews(reviews: Review[], initialFilters: Partial<ReviewFilters> = {}) {
  const [filters, setFilters] = useState<ReviewFilters>({
    search: "",
    rating: "",
    channel: "",
    sentiment: "",
    approved: "",
    dateRange: "all",
    sortBy: "recent",
    ...initialFilters,
  })

  const filteredAndSortedReviews = useMemo(() => {
    const filtered = filterReviews(reviews, filters)
    return sortReviews(filtered, filters.sortBy || "recent")
  }, [reviews, filters])

  const updateFilter = (key: keyof ReviewFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const updateFilters = (newFilters: Partial<ReviewFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      rating: "",
      channel: "",
      sentiment: "",
      approved: "",
      dateRange: "all",
      sortBy: "recent",
    })
  }

  return {
    filteredReviews: filteredAndSortedReviews,
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
  }
}
