import { getSentimentFromRating, shouldAutoApprove } from "./utils"

// Mock data structure based on Hostaway API format
export const mockHostawayReviews = [
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
export interface NormalizedReview {
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
export function normalizeHostawayReviews(rawReviews: any[]): NormalizedReview[] {
  return rawReviews.map((review) => {
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
      approved: shouldAutoApprove(review.rating),
      sentiment: getSentimentFromRating(review.rating),
    }
  })
}
