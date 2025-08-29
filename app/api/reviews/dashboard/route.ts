import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const rating = searchParams.get("rating")
    const category = searchParams.get("category")
    const channel = searchParams.get("channel")
    const status = searchParams.get("status") || "all"
    const sortBy = searchParams.get("sortBy") || "date_created"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // Build query
    let query = supabase.from("reviews").select("*")

    // Apply filters
    if (rating) {
      query = query.eq("rating", Number.parseInt(rating))
    }
    if (category && category !== "all") {
      query = query.eq("category", category)
    }
    if (channel && channel !== "all") {
      query = query.eq("channel", channel)
    }
    if (status !== "all") {
      query = query.eq("approval_status", status)
    }

    // Apply sorting and limit
    query = query.order(sortBy, { ascending: sortOrder === "asc" }).limit(limit)

    const { data: reviews, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    // Transform data for dashboard consumption
    const transformedReviews =
      reviews?.map((review) => ({
        id: review.external_id,
        propertyId: review.metadata?.property_id || "",
        propertyName: review.property_name,
        guestName: review.guest_name,
        guestAvatar: review.guest_avatar,
        rating: review.rating,
        comment: review.content,
        date: review.date_created,
        channel: review.channel,
        categories: review.metadata?.categories || {},
        hostResponse: review.host_response,
        verified: review.metadata?.verified || false,
        approved: review.approval_status === "approved",
        sentiment: review.category,
        approvalStatus: review.approval_status,
        approvedBy: review.approved_by,
        approvedAt: review.approved_at,
      })) || []

    // Calculate summary statistics
    const summary = {
      total: transformedReviews.length,
      averageRating:
        transformedReviews.length > 0
          ? transformedReviews.reduce((sum, r) => sum + r.rating, 0) / transformedReviews.length
          : 0,
      pending: transformedReviews.filter((r) => r.approvalStatus === "pending").length,
      approved: transformedReviews.filter((r) => r.approvalStatus === "approved").length,
      rejected: transformedReviews.filter((r) => r.approvalStatus === "rejected").length,
      channels: [...new Set(transformedReviews.map((r) => r.channel))],
      categories: [...new Set(transformedReviews.map((r) => r.sentiment))],
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: transformedReviews,
        summary,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
