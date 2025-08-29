export interface Review {
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
  source?: string
  authorUrl?: string
  authorPhoto?: string
}
