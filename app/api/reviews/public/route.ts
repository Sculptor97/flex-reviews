import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const rating = searchParams.get("rating")
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sortBy") || "date_created"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Build query - only approved reviews
    let query = supabase.from("reviews").select("*").eq("approval_status", "approved")

    // Apply filters
    if (rating) {
      query = query.eq("rating", Number.parseInt(rating))
    }
    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    // Apply sorting and limit
    query = query.order(sortBy, { ascending: sortOrder === "asc" }).limit(limit)

    const { data: reviews, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    // Transform data for public consumption
    const transformedReviews =
      reviews?.map((review) => ({
        id: review.external_id,
        propertyName: review.property_name,
        guestName: review.guest_name,
        guestAvatar: review.guest_avatar,
        rating: review.rating,
        title: review.title,
        content: review.content,
        category: review.category,
        channel: review.channel,
        dateCreated: review.date_created,
        hostResponse: review.host_response,
        hostResponseDate: review.host_response_date,
      })) || []

    // Calculate summary statistics for approved reviews only
    const summary = {
      total: transformedReviews.length,
      averageRating:
        transformedReviews.length > 0
          ? transformedReviews.reduce((sum, r) => sum + r.rating, 0) / transformedReviews.length
          : 0,
      categories: [...new Set(transformedReviews.map((r) => r.category))],
      channels: [...new Set(transformedReviews.map((r) => r.channel))],
    }

    return NextResponse.json({
      reviews: transformedReviews,
      summary,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
