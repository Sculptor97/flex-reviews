import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Mock data structure based on Hostaway API format
const mockHostawayReviews = [
  {
    id: "rev_001",
    listing_id: "prop_123",
    guest_name: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely loved our stay! The apartment was spotless, beautifully decorated, and in the perfect location. The host was incredibly responsive and helpful. Would definitely book again!",
    created_at: "2024-01-15T10:30:00Z",
    channel: "Airbnb",
    categories: {
      cleanliness: 5,
      communication: 5,
      check_in: 5,
      accuracy: 5,
      location: 5,
      value: 5,
    },
    property_name: "Modern Downtown Loft",
    response: null,
    verified: true,
  },
  {
    id: "rev_002",
    listing_id: "prop_124",
    guest_name: "Michael Chen",
    rating: 4,
    comment:
      "Great location and clean space. The WiFi was a bit slow for work calls, but overall a pleasant stay. The kitchen was well-equipped and the bed was comfortable.",
    created_at: "2024-01-12T14:22:00Z",
    channel: "Booking.com",
    categories: {
      cleanliness: 5,
      communication: 4,
      check_in: 4,
      accuracy: 4,
      location: 5,
      value: 4,
    },
    property_name: "Cozy Studio Near Park",
    response:
      "Thank you for your feedback! We've upgraded our internet package to provide better connectivity for our guests.",
    verified: true,
  },
  {
    id: "rev_003",
    listing_id: "prop_125",
    guest_name: "Emma Rodriguez",
    rating: 3,
    comment:
      "The apartment was okay but had some maintenance issues. The shower pressure was very low and there was a strange smell in the bathroom. Location was good though.",
    created_at: "2024-01-10T09:15:00Z",
    channel: "VRBO",
    categories: {
      cleanliness: 3,
      communication: 4,
      check_in: 4,
      accuracy: 3,
      location: 4,
      value: 3,
    },
    property_name: "City Center Apartment",
    response: null,
    verified: true,
  },
  {
    id: "rev_004",
    listing_id: "prop_123",
    guest_name: "David Kim",
    rating: 5,
    comment:
      "Exceptional experience from start to finish. The property exceeded our expectations in every way. Perfect for a romantic getaway!",
    created_at: "2024-01-08T16:45:00Z",
    channel: "Airbnb",
    categories: {
      cleanliness: 5,
      communication: 5,
      check_in: 5,
      accuracy: 5,
      location: 5,
      value: 5,
    },
    property_name: "Modern Downtown Loft",
    response: "So happy you enjoyed your stay! Thank you for being wonderful guests.",
    verified: true,
  },
  {
    id: "rev_005",
    listing_id: "prop_126",
    guest_name: "Lisa Thompson",
    rating: 2,
    comment:
      "Unfortunately, the apartment was not as advertised. It was quite dirty upon arrival and several amenities mentioned in the listing were not available. Very disappointing.",
    created_at: "2024-01-05T11:20:00Z",
    channel: "Airbnb",
    categories: {
      cleanliness: 2,
      communication: 3,
      check_in: 3,
      accuracy: 2,
      location: 4,
      value: 2,
    },
    property_name: "Beachside Retreat",
    response: null,
    verified: true,
  },
]

// Normalized review interface
interface NormalizedReview {
  id: string
  propertyId: string
  propertyName: string
  guestName: string
  rating: number
  comment: string
  date: string
  channel: string
  categories: {
    cleanliness: number
    communication: number
    checkIn: number
    accuracy: number
    location: number
    value: number
  }
  hostResponse?: string
  verified: boolean
  approved: boolean
  sentiment: "positive" | "neutral" | "negative"
}

// Data normalization function
function normalizeHostawayReviews(rawReviews: any[]): NormalizedReview[] {
  return rawReviews.map((review) => {
    // Determine sentiment based on rating
    let sentiment: "positive" | "neutral" | "negative" = "neutral"
    if (review.rating >= 4) sentiment = "positive"
    else if (review.rating <= 2) sentiment = "negative"

    return {
      id: review.id,
      propertyId: review.listing_id,
      propertyName: review.property_name,
      guestName: review.guest_name,
      rating: review.rating,
      comment: review.comment,
      date: review.created_at,
      channel: review.channel,
      categories: {
        cleanliness: review.categories.cleanliness,
        communication: review.categories.communication,
        checkIn: review.categories.check_in,
        accuracy: review.categories.accuracy,
        location: review.categories.location,
        value: review.categories.value,
      },
      hostResponse: review.response,
      verified: review.verified,
      approved: review.rating >= 4, // Auto-approve 4+ star reviews
      sentiment,
    }
  })
}

// Function to sync reviews to database
async function syncReviewsToDatabase(reviews: NormalizedReview[]) {
  const supabase = await createClient()

  for (const review of reviews) {
    // Check if review already exists
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("external_id", review.id)
      .eq("source", "hostaway")
      .single()

    if (!existingReview) {
      // Insert new review
      const { error } = await supabase.from("reviews").insert({
        external_id: review.id,
        source: "hostaway",
        property_name: review.propertyName,
        guest_name: review.guestName,
        guest_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.guestName)}&background=284E4C&color=fff`,
        rating: review.rating,
        title: `${review.rating} star review`,
        content: review.comment,
        category: review.sentiment,
        channel: review.channel,
        date_created: review.date,
        approval_status: review.approved ? "approved" : "pending",
        host_response: review.hostResponse,
        host_response_date: review.hostResponse ? review.date : null,
        metadata: {
          categories: review.categories,
          verified: review.verified,
          property_id: review.propertyId,
        },
      })

      if (error) {
        console.error("Error inserting review:", error)
      }
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("property_id")
    const channel = searchParams.get("channel")
    const minRating = searchParams.get("min_rating")
    const limit = searchParams.get("limit") || "50"

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredReviews = [...mockHostawayReviews]

    // Apply filters
    if (propertyId) {
      filteredReviews = filteredReviews.filter((review) => review.listing_id === propertyId)
    }

    if (channel) {
      filteredReviews = filteredReviews.filter((review) => review.channel.toLowerCase() === channel.toLowerCase())
    }

    if (minRating) {
      filteredReviews = filteredReviews.filter((review) => review.rating >= Number.parseInt(minRating))
    }

    // Limit results
    filteredReviews = filteredReviews.slice(0, Number.parseInt(limit))

    // Normalize the data
    const normalizedReviews = normalizeHostawayReviews(filteredReviews)

    await syncReviewsToDatabase(normalizedReviews)

    // Calculate summary statistics
    const totalReviews = normalizedReviews.length
    const averageRating =
      totalReviews > 0 ? normalizedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

    const channelBreakdown = normalizedReviews.reduce(
      (acc, review) => {
        acc[review.channel] = (acc[review.channel] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const sentimentBreakdown = normalizedReviews.reduce(
      (acc, review) => {
        acc[review.sentiment] = (acc[review.sentiment] || 0) + 1
        return acc
      },
      { positive: 0, neutral: 0, negative: 0 },
    )

    return NextResponse.json({
      success: true,
      data: {
        reviews: normalizedReviews,
        summary: {
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          channelBreakdown,
          sentimentBreakdown,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: "hostaway_api",
        filters: {
          propertyId,
          channel,
          minRating,
          limit: Number.parseInt(limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching Hostaway reviews:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// API route for updating review approval status
export async function PATCH(request: Request) {
  try {
    const { reviewIds, action, approvedBy } = await request.json()
    const supabase = await createClient()

    const approvalStatus = action === "approve" ? "approved" : "rejected"

    const { error } = await supabase
      .from("reviews")
      .update({
        approval_status: approvalStatus,
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      })
      .in("external_id", reviewIds)

    if (error) {
      console.error("Error updating review approval:", error)
      return NextResponse.json({ error: "Failed to update reviews" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${reviewIds.length} review(s)`,
    })
  } catch (error) {
    console.error("Error in PATCH request:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
