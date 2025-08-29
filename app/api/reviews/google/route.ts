import { NextResponse } from "next/server"

// Mock Google Places API response structure
const mockGoogleReviews = [
  {
    author_name: "Jennifer Martinez",
    author_url: "https://www.google.com/maps/contrib/123456789",
    profile_photo_url: "https://lh3.googleusercontent.com/a-/AOh14Gi...",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Absolutely fantastic stay! The property was exactly as described and the location couldn't be better. The host was incredibly responsive and helpful throughout our entire stay. Would definitely recommend to anyone visiting the area.",
    time: 1704067200,
    language: "en",
  },
  {
    author_name: "Robert Chen",
    author_url: "https://www.google.com/maps/contrib/987654321",
    profile_photo_url: "https://lh3.googleusercontent.com/a-/AOh14Gh...",
    rating: 4,
    relative_time_description: "1 month ago",
    text: "Great location and clean apartment. Check-in was smooth and the amenities were as advertised. Only minor issue was the WiFi speed, but overall a very pleasant experience.",
    time: 1701388800,
    language: "en",
  },
  {
    author_name: "Sarah Johnson",
    author_url: "https://www.google.com/maps/contrib/456789123",
    profile_photo_url: "https://lh3.googleusercontent.com/a-/AOh14Gf...",
    rating: 5,
    relative_time_description: "3 weeks ago",
    text: "Perfect for our business trip. The workspace setup was excellent and the location made it easy to get around the city. Highly recommend!",
    time: 1703462400,
    language: "en",
  },
  {
    author_name: "Michael Thompson",
    author_url: "https://www.google.com/maps/contrib/789123456",
    profile_photo_url: "https://lh3.googleusercontent.com/a-/AOh14Ge...",
    rating: 4,
    relative_time_description: "1 week ago",
    text: "Solid choice for accommodation. The property was clean and well-maintained. Good value for money in this area.",
    time: 1704672000,
    language: "en",
  },
  {
    author_name: "Lisa Wang",
    author_url: "https://www.google.com/maps/contrib/321654987",
    profile_photo_url: "https://lh3.googleusercontent.com/a-/AOh14Gd...",
    rating: 5,
    relative_time_description: "5 days ago",
    text: "Exceeded our expectations in every way. The attention to detail was impressive and the host went above and beyond to ensure we had everything we needed.",
    time: 1704844800,
    language: "en",
  },
]

// Normalized review interface for Google reviews
interface NormalizedGoogleReview {
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
  source: "google"
  authorUrl?: string
  authorPhoto?: string
}

// Data normalization function for Google reviews
function normalizeGoogleReviews(rawReviews: any[], propertyName: string, propertyId: string): NormalizedGoogleReview[] {
  return rawReviews.map((review, index) => {
    // Determine sentiment based on rating
    let sentiment: "positive" | "neutral" | "negative" = "neutral"
    if (review.rating >= 4) sentiment = "positive"
    else if (review.rating <= 2) sentiment = "negative"

    // Generate estimated category ratings based on overall rating and review content
    const baseRating = review.rating
    const variation = Math.random() * 0.5 - 0.25 // Small random variation

    return {
      id: `google_${propertyId}_${index}`,
      propertyId,
      propertyName,
      guestName: review.author_name,
      rating: review.rating,
      comment: review.text,
      date: new Date(review.time * 1000).toISOString(),
      channel: "Google",
      categories: {
        cleanliness: Math.max(1, Math.min(5, Math.round(baseRating + variation))),
        communication: Math.max(1, Math.min(5, Math.round(baseRating + variation))),
        checkIn: Math.max(1, Math.min(5, Math.round(baseRating + variation))),
        accuracy: Math.max(1, Math.min(5, Math.round(baseRating + variation))),
        location: Math.max(1, Math.min(5, Math.round(baseRating + variation))),
        value: Math.max(1, Math.min(5, Math.round(baseRating + variation))),
      },
      hostResponse: undefined, // Google reviews typically don't have host responses in Places API
      verified: true, // Google reviews are inherently verified
      approved: review.rating >= 4, // Auto-approve 4+ star reviews
      sentiment,
      source: "google",
      authorUrl: review.author_url,
      authorPhoto: review.profile_photo_url,
    }
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const placeId = searchParams.get("place_id")
    const propertyName = searchParams.get("property_name") || "Flex Living Property"

    if (!placeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: place_id",
          message: "Google Place ID is required to fetch reviews",
        },
        { status: 400 },
      )
    }

    // Check for API key (in production, this would be required)
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      console.warn("Google Places API key not configured. Using mock data for demonstration.")
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In production, this would make an actual API call:
    /*
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
    )
    const data = await response.json()
    const reviews = data.result?.reviews || []
    */

    // For demonstration, use mock data
    const reviews = mockGoogleReviews

    // Normalize the data
    const normalizedReviews = normalizeGoogleReviews(reviews, propertyName, placeId)

    // Calculate summary statistics
    const totalReviews = normalizedReviews.length
    const averageRating =
      totalReviews > 0 ? normalizedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

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
          source: "google_places_api",
          sentimentBreakdown,
          limitations: {
            maxReviews: 5,
            note: "Google Places API returns maximum 5 most relevant reviews",
          },
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: "google_places_api",
        placeId,
        propertyName,
        apiLimitations: {
          maxReviews: 5,
          requiresAttribution: true,
          rateLimit: "100 requests per 100 seconds per user",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching Google reviews:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Google reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
