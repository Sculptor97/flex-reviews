import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Review from "@/models/Review"
import { mockHostawayReviews, normalizeHostawayReviews } from "@/lib/hostaway/data"
import {
  syncReviewsToDatabase,
  ensureDataExists,
  buildQueryFromParams,
  buildSortFromParams,
  getPaginationParams,
  transformReviewsForAPI,
  generateSummaryFromReviews,
} from "@/lib/hostaway/database"

// GET - Fetch reviews with filtering (main CRUD operation)
export async function GET(request: Request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const sync = searchParams.get("sync") === "true" // Force sync
    const includeSummary = searchParams.get("summary") === "true" // Include summary

    // If sync is requested, sync the mock data
    if (sync) {
      const normalizedReviews = normalizeHostawayReviews(mockHostawayReviews)
      await syncReviewsToDatabase(normalizedReviews)
    } else {
      // Ensure data exists before proceeding
      const normalizedReviews = normalizeHostawayReviews(mockHostawayReviews)
      await ensureDataExists(normalizedReviews)
    }

    // Build query, sort, and pagination from parameters
    const query = buildQueryFromParams(searchParams)
    const sortObject = buildSortFromParams(searchParams)
    const { limit, page, skip } = getPaginationParams(searchParams)

    // Execute query with pagination
    const reviews = await Review.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const totalCount = await Review.countDocuments(query)

    // Transform data to consistent format
    const transformedReviews = transformReviewsForAPI(reviews)

    // Prepare response data
    const responseData: any = {
      reviews: transformedReviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    }

    // Include summary if requested
    if (includeSummary) {
      // Get all reviews for summary calculation (not just paginated ones)
      const allReviews = await Review.find(query).lean()
      const allTransformedReviews = transformReviewsForAPI(allReviews)
      responseData.summary = generateSummaryFromReviews(allTransformedReviews)
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update review approval status
export async function PATCH(request: Request) {
  try {
    await connectDB()
    const { reviewIds, approved, approvedBy } = await request.json()

    if (!reviewIds || !Array.isArray(reviewIds)) {
      return NextResponse.json({ success: false, error: "Review IDs are required" }, { status: 400 })
    }

    // Update approval status in database
    const updateData = {
      is_approved: approved,
      approved_by: approvedBy || "Manager",
      approved_at: approved ? new Date() : null,
      updated_at: new Date(),
    }

    const result = await Review.updateMany(
      { external_id: { $in: reviewIds } },
      updateData
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "No reviews found" }, { status: 404 })
    }

    // Fetch updated reviews
    const updatedReviews = await Review.find({ external_id: { $in: reviewIds } }).lean()

    return NextResponse.json({
      success: true,
      data: {
        updatedReviews,
        message: `${result.modifiedCount} review(s) ${approved ? "approved" : "unapproved"} successfully`,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new review (for manual entry or API ingestion)
export async function POST(request: Request) {
  try {
    await connectDB()
    const reviewData = await request.json()

    const newReview = new Review({
      external_id: reviewData.external_id,
      source: reviewData.source || "manual",
      property_id: reviewData.property_id,
      property_name: reviewData.property_name,
      guest_name: reviewData.guest_name,
      guest_avatar: reviewData.guest_avatar,
      rating: reviewData.rating,
      comment: reviewData.comment,
      category: reviewData.category,
      channel: reviewData.channel,
      date: new Date(reviewData.date),
      is_approved: reviewData.is_approved || false,
      response: reviewData.response,
      response_date: reviewData.response_date ? new Date(reviewData.response_date) : null,
    })

    await newReview.save()

    return NextResponse.json({
      success: true,
      data: {
        review: newReview,
        message: "Review created successfully",
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete review
export async function DELETE(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("id")

    if (!reviewId) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 })
    }

    const result = await Review.deleteOne({ external_id: reviewId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
