"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Quote, Calendar, MapPin, Users, ArrowRight, Bed, Bath, Users as UsersIcon } from "lucide-react"
import Link from "next/link"
import { ReviewService } from "@/services/reviewService"

interface Review {
  id: string
  propertyId: string
  propertyName: string
  guestName: string
  guestAvatar?: string
  rating: number
  comment: string
  date: string
  channel: string
  source: string
  category: string
  isApproved: boolean
  approvedBy?: string
  approvedAt?: string
  response?: string
  responseDate?: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data: {
    reviews: Review[]
    summary?: {
      totalReviews: number
      averageRating: number
      channelBreakdown: Record<string, number>
      sentimentBreakdown: {
        positive: number
        neutral: number
        negative: number
      }
      ratingBreakdown: Record<number, number>
      approvalBreakdown: {
        approved: number
        pending: number
      }
    }
  }
}

export default function PublicReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [expandedReviews, setExpandedReviews] = useState<string[]>([])

  // Filter states
  const [filters, setFilters] = useState({
    rating: "all",
    property: "all",
    sortBy: "recent",
  })

  // Mock property data with Unsplash images
  const property = {
    id: 163276,
    title: "Charming Apartment in Belsize Park",
    subtitle: "Belsize Park, London — 1 guest",
    pricePerNight: 120,
    rating: 4.8,
    reviewsCount: 42,
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    details: {
      bedrooms: 1,
      bathrooms: 1,
      guests: 1,
      description:
        "A bright and cozy apartment in the heart of Belsize Park. Close to transport, shops and parks.",
      amenities: ["Wi‑Fi", "Kitchen", "Washer", "Heating"],
    },
    location: {
      address: "Belsize Park, London",
      mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.5!2d-0.1636!3d51.5475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMyJzUxLjAiTiAwc8KwMDknNDkuMCJX!5e0!3m2!1sen!2suk!4v1234567890"
    }
  }

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await ReviewService.fetchPublicReviews()

      if (response.success) {
        setReviews(response.data.reviews)
        setFilteredReviews(response.data.reviews)
        setSummary(response.data.summary)
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...reviews]

    if (filters.rating !== "all") {
      filtered = filtered.filter((review) => review.rating >= Number.parseInt(filters.rating))
    }

    if (filters.property !== "all") {
      filtered = filtered.filter((review) => review.propertyName === filters.property)
    }

    // Sort reviews
    if (filters.sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (filters.sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredReviews(filtered)
  }, [filters, reviews])

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews((prev) => (prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]))
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "airbnb":
        return "bg-pink-100 text-pink-800"
      case "booking.com":
        return "bg-blue-100 text-blue-800"
      case "vrbo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const uniqueProperties = [...new Set(reviews.map((review) => review.propertyName))]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-card-foreground mb-4">Flex Living Reviews</h1>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover our featured properties and authentic guest experiences.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Property Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-card-foreground mb-8 text-center">Featured Property</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left column - Gallery and details */}
            <div className="md:col-span-2">
              <div className="rounded-xl overflow-hidden shadow-lg bg-card">
                {/* Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                  {property.gallery.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${property.title} image ${i + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-card-foreground">{property.title}</h3>
                <p className="text-sm text-muted-foreground">{property.subtitle}</p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-card-foreground">{property.rating}</span>
                    <span className="text-sm text-muted-foreground">({property.reviewsCount} reviews)</span>
                  </div>

                  <div className="ml-auto text-right">
                    <div className="text-lg font-bold text-card-foreground">${property.pricePerNight}</div>
                    <div className="text-sm text-muted-foreground">per night</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-card-foreground mb-3">About this property</h4>
                  <p className="text-sm text-muted-foreground mb-4">{property.details.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4 text-brand-teal" />
                      <span className="text-card-foreground">{property.details.bedrooms} Bedroom{property.details.bedrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4 text-brand-teal" />
                      <span className="text-card-foreground">{property.details.bathrooms} Bathroom{property.details.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-brand-teal" />
                      <span className="text-card-foreground">{property.details.guests} Guest{property.details.guests !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-card-foreground">
                      Amenities: {property.details.amenities.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - booking card + map */}
            <aside className="space-y-6">
              <Card className="border-2 border-brand-sage">
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-card-foreground">${property.pricePerNight}</div>
                      <div className="text-sm text-muted-foreground">per night</div>
                    </div>
                    <div className="text-sm text-card-foreground flex items-center gap-1">
                      {property.rating} <Star className="h-4 w-4 fill-brand-teal text-brand-teal" />
                    </div>
                  </div>

                  <Button className="w-full bg-brand-teal text-brand-cream hover:bg-brand-cream hover:text-brand-teal">
                    Book now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-brand-sage">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-card-foreground mb-3">Location</h4>
                  <p className="text-sm text-muted-foreground mb-4">{property.location.address}</p>
                  {/* Map placeholder */}
                  <div className="bg-brand-sage h-40 flex items-center justify-center text-xs text-muted-foreground rounded-lg">
                    <MapPin className="h-6 w-6 mr-2" />
                    Interactive Map
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>

        {/* Reviews Section Header */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-card-foreground mb-4">Hear from Our Guests!</h2>
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover what makes Flex Living properties special through authentic reviews from our valued guests.
            </p>

            {/* Summary Stats */}
            {summary && (
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.round(summary.averageRating) ? "fill-brand-teal text-brand-teal" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-card-foreground">{summary.averageRating.toFixed(1)}/5</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-card-foreground">{summary.totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Verified Reviews</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-card-foreground">{uniqueProperties.length}</div>
                  <div className="text-sm text-muted-foreground">Properties</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Filter by rating:</label>
            <Select
              value={filters.rating}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
                <SelectItem value="4">4+ stars</SelectItem>
                <SelectItem value="3">3+ stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Property:</label>
            <Select
              value={filters.property}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, property: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {uniqueProperties.map((property) => (
                  <SelectItem key={property} value={property}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Sort by:</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading reviews...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredReviews.map((review) => {
              const isExpanded = expandedReviews.includes(review.id)
              const shouldTruncate = review.comment.length > 150

              return (
                <Card key={review.id} className="h-fit hover:shadow-lg transition-shadow duration-200 border-2 border-brand-sage">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg text-card-foreground">{review.propertyName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4" />
                          {review.guestName}
                          <Calendar className="h-4 w-4 ml-2" />
                          {new Date(review.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                      </div>
                      <Badge className={getChannelColor(review.channel)} variant="secondary">
                        {review.channel}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-brand-teal text-brand-teal" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{review.rating}/5</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="relative">
                      <Quote className="h-5 w-5 text-brand-teal mb-2" />
                      <p className="text-card-foreground leading-relaxed mb-4">
                        {isExpanded || !shouldTruncate ? review.comment : truncateText(review.comment)}
                      </p>

                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpanded(review.id)}
                          className="text-brand-teal hover:text-brand-teal/80 text-sm font-medium"
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>

                    {review.response && (
                      <div className="bg-brand-cream p-3 rounded-lg mt-4">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Host Response:</p>
                        <p className="text-sm text-card-foreground">{review.response}</p>
                      </div>
                    )}

                    {/* Sentiment badge for 5-star reviews */}
                    {review.rating === 5 && (
                      <div className="mt-4 pt-4 border-t">
                        <Badge 
                          variant="secondary" 
                          className={
                            review.category === "positive" 
                              ? "bg-green-100 text-green-800" 
                              : review.category === "negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {review.category} review
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-card rounded-lg p-6 sm:p-8 border-2 border-brand-sage">
          <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-4">Ready to Experience Flex Living?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of satisfied guests who have made Flex Living their home away from home. Book your perfect
            stay today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:space-x-4">
            <Button size="lg" className="w-full sm:w-auto bg-brand-teal text-brand-cream hover:bg-brand-cream hover:text-brand-teal">
              <MapPin className="mr-2 h-5 w-5" />
              Browse Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-brand-cream">
                Manager Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
