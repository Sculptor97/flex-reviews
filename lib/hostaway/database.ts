import connectDB from "@/lib/mongodb"
import Review from "@/models/Review"
import { NormalizedReview } from "./data"
import { generateAvatarUrl } from "./utils"

// Function to sync reviews to database
export async function syncReviewsToDatabase(reviews: NormalizedReview[]) {
  await connectDB()

  for (const review of reviews) {
    // Check if review already exists
    const existingReview = await Review.findOne({
      external_id: review.id,
      source: "hostaway"
    })

    if (!existingReview) {
      // Insert new review
      const newReview = new Review({
        external_id: review.id,
        source: "hostaway",
        property_id: review.propertyId,
        property_name: review.propertyName,
        guest_name: review.guestName,
        guest_avatar: generateAvatarUrl(review.guestName),
        rating: review.rating,
        comment: review.comment,
        category: review.sentiment,
        channel: review.channel,
        date: new Date(review.date),
        is_approved: review.approved,
        response: review.hostResponse,
        response_date: review.hostResponse ? new Date(review.date) : null,
      })

      try {
        await newReview.save()
      } catch (error) {
        console.error("Error inserting review:", error)
      }
    }
  }
}

// Function to check if database is empty and populate it
export async function ensureDataExists(normalizedReviews: NormalizedReview[]) {
  const reviewCount = await Review.countDocuments()
  
  if (reviewCount === 0) {
    console.log("Database is empty. Triggering data ingestion...")
    
    try {
      await syncReviewsToDatabase(normalizedReviews)
      console.log("Data ingestion completed successfully")
      return true
    } catch (error) {
      console.error("Error during data ingestion:", error)
      return false
    }
  }
  
  return false
}

// Function to build query from search parameters
export function buildQueryFromParams(searchParams: URLSearchParams) {
  const rating = searchParams.get("rating")
  const category = searchParams.get("category")
  const channel = searchParams.get("channel")
  const source = searchParams.get("source")
  const approved = searchParams.get("approved")
  const propertyId = searchParams.get("property_id")

  let query: any = {}

  // Apply filters
  if (rating) {
    query.rating = Number.parseInt(rating)
  }
  if (category && category !== "all") {
    query.category = category
  }
  if (channel && channel !== "all") {
    query.channel = channel
  }
  if (source && source !== "all") {
    query.source = source
  }
  if (approved !== null && approved !== undefined) {
    query.is_approved = approved === "true"
  }
  if (propertyId) {
    query.property_id = propertyId
  }

  return query
}

// Function to build sort object from search parameters
export function buildSortFromParams(searchParams: URLSearchParams) {
  const sortBy = searchParams.get("sortBy") || "date"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const sortObject: any = {}
  sortObject[sortBy] = sortOrder === "asc" ? 1 : -1

  return sortObject
}

// Function to get pagination parameters from search parameters
export function getPaginationParams(searchParams: URLSearchParams) {
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const skip = (page - 1) * limit

  return { limit, page, skip }
}

// Function to transform database reviews to API format
export function transformReviewsForAPI(reviews: any[]) {
  return reviews.map((review) => ({
    id: review.external_id,
    propertyId: review.property_id,
    propertyName: review.property_name,
    guestName: review.guest_name,
    guestAvatar: review.guest_avatar,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    channel: review.channel,
    source: review.source,
    category: review.category,
    isApproved: review.is_approved,
    approvedBy: review.approved_by,
    approvedAt: review.approved_at,
    response: review.response,
    responseDate: review.response_date,
    createdAt: review.created_at,
    updatedAt: review.updated_at,
  }))
}

// Function to generate summary statistics from reviews
export function generateSummaryFromReviews(reviews: any[]) {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      channelBreakdown: {},
      sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
      ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      approvalBreakdown: { approved: 0, pending: 0 },
    }
  }

  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

  // Channel breakdown
  const channelBreakdown = reviews.reduce((acc, review) => {
    acc[review.channel] = (acc[review.channel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Sentiment breakdown
  const sentimentBreakdown = reviews.reduce((acc, review) => {
    const sentiment = review.category // category field contains sentiment
    acc[sentiment] = (acc[sentiment] || 0) + 1
    return acc
  }, { positive: 0, neutral: 0, negative: 0 } as Record<string, number>)

  // Rating breakdown
  const ratingBreakdown = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>)

  // Approval breakdown
  const approvalBreakdown = reviews.reduce((acc, review) => {
    if (review.is_approved) {
      acc.approved += 1
    } else {
      acc.pending += 1
    }
    return acc
  }, { approved: 0, pending: 0 })

  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    channelBreakdown,
    sentimentBreakdown,
    ratingBreakdown,
    approvalBreakdown,
  }
}
