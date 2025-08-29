"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Star, ExternalLink, AlertTriangle, CheckCircle, Info, Globe, Building, Users, Clock, Zap } from "lucide-react"
import Link from "next/link"

interface GoogleReview {
  id: string
  propertyId: string
  propertyName: string
  guestName: string
  rating: number
  comment: string
  date: string
  channel: string
  source: string
  authorUrl?: string
  authorPhoto?: string
  verified: boolean
  approved: boolean
  sentiment: "positive" | "neutral" | "negative"
}

interface ApiResponse {
  success: boolean
  data: {
    reviews: GoogleReview[]
    summary: {
      totalReviews: number
      averageRating: number
      source: string
      limitations?: {
        maxReviews: number
        note: string
      }
    }
  }
  meta: {
    apiLimitations: {
      maxReviews: number
      requiresAttribution: boolean
      rateLimit: string
    }
  }
}

export default function GoogleIntegrationPage() {
  const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([])
  const [combinedReviews, setCombinedReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [placeId, setPlaceId] = useState("ChIJN1t_tDeuEmsRUsoyG83frY4") // Example Place ID
  const [activeTab, setActiveTab] = useState("overview")

  const fetchGoogleReviews = async () => {
    if (!placeId.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/reviews/google?place_id=${placeId}&property_name=Modern Downtown Loft`)
      const data: ApiResponse = await response.json()

      if (data.success) {
        setGoogleReviews(data.data.reviews)
      }
    } catch (error) {
      console.error("Failed to fetch Google reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCombinedReviews = async () => {
    if (!placeId.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/reviews/combined?include_google=true&place_id=${placeId}`)
      const data = await response.json()

      if (data.success) {
        setCombinedReviews(data.data.reviews)
      }
    } catch (error) {
      console.error("Failed to fetch combined reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "google":
        return "bg-blue-100 text-blue-800"
      case "airbnb":
        return "bg-pink-100 text-pink-800"
      case "booking.com":
        return "bg-indigo-100 text-indigo-800"
      case "vrbo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-card-foreground">Flex Living</h1>
            </Link>
            <Badge variant="secondary">Google Integration Demo</Badge>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Manager Dashboard
              </Button>
            </Link>
            <Link href="/reviews">
              <Button variant="outline" size="sm">
                Public Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Google Places API Integration</h1>
          <p className="text-muted-foreground text-lg">
            Explore how Google reviews can be integrated with your existing review management system.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="combined">Combined Reviews</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Broader Review Coverage</p>
                      <p className="text-sm text-muted-foreground">Access reviews from Google's vast user base</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Verified Reviews</p>
                      <p className="text-sm text-muted-foreground">
                        Google reviews are inherently verified and trusted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Property-Specific</p>
                      <p className="text-sm text-muted-foreground">Target specific property locations with Place IDs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Limitations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium">Maximum 5 Reviews</p>
                      <p className="text-sm text-muted-foreground">Places API returns only 5 most relevant reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-4 w-4 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium">Rate Limits</p>
                      <p className="text-sm text-muted-foreground">100 requests per 100 seconds per user</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-4 w-4 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium">Attribution Required</p>
                      <p className="text-sm text-muted-foreground">Must display author links and Google branding</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alternatives */}
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>For More Reviews</AlertTitle>
              <AlertDescription>
                To access more than 5 reviews, consider Google My Business API (requires approval) or third-party
                services like Featurable API. These solutions require business ownership verification and may have
                additional costs.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="demo">
            <div className="space-y-6">
              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Google Places Configuration</CardTitle>
                  <CardDescription>
                    Enter a Google Place ID to fetch reviews. This demo uses mock data for demonstration.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="place-id">Google Place ID</Label>
                      <Input
                        id="place-id"
                        placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
                        value={placeId}
                        onChange={(e) => setPlaceId(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Find Place IDs using the{" "}
                        <a
                          href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          Place ID Finder
                        </a>
                      </p>
                    </div>
                    <Button onClick={fetchGoogleReviews} disabled={loading || !placeId.trim()}>
                      {loading ? "Loading..." : "Fetch Reviews"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Google Reviews */}
              {googleReviews.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Google Reviews ({googleReviews.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {googleReviews.map((review) => (
                      <Card key={review.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {review.authorPhoto && (
                                <img
                                  src="/diverse-user-avatars.png"
                                  alt={review.guestName}
                                  className="w-10 h-10 rounded-full"
                                />
                              )}
                              <div>
                                <CardTitle className="text-base">
                                  {review.authorUrl ? (
                                    <a
                                      href={review.authorUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-accent hover:underline flex items-center gap-1"
                                    >
                                      {review.guestName}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : (
                                    review.guestName
                                  )}
                                </CardTitle>
                                <CardDescription>{new Date(review.date).toLocaleDateString()}</CardDescription>
                              </div>
                            </div>
                            <Badge className={getChannelColor(review.channel)}>{review.channel}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-primary text-primary" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">{review.rating}/5</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-card-foreground text-sm leading-relaxed">{review.comment}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={getSentimentColor(review.sentiment)} variant="secondary">
                              {review.sentiment}
                            </Badge>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-800" variant="secondary">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="combined">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Combined Review Sources</CardTitle>
                  <CardDescription>
                    See how Google reviews integrate with your existing Hostaway reviews for a comprehensive view.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={fetchCombinedReviews} disabled={loading || !placeId.trim()}>
                    {loading ? "Loading..." : "Fetch Combined Reviews"}
                  </Button>
                </CardContent>
              </Card>

              {combinedReviews.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">All Reviews ({combinedReviews.length})</h3>
                    <div className="flex items-center gap-2">
                      {["Hostaway", "Google", "Airbnb", "Booking.com", "VRBO"].map((channel) => {
                        const count = combinedReviews.filter((r) => r.channel === channel).length
                        return count > 0 ? (
                          <Badge key={channel} className={getChannelColor(channel)} variant="secondary">
                            {channel}: {count}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {combinedReviews.slice(0, 12).map((review) => (
                      <Card key={review.id} className="h-fit">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{review.guestName}</CardTitle>
                              <CardDescription>{new Date(review.date).toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge className={getChannelColor(review.channel)}>{review.channel}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-primary text-primary" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">{review.rating}/5</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-card-foreground text-sm leading-relaxed line-clamp-3">{review.comment}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={getSentimentColor(review.sentiment)} variant="secondary">
                              {review.sentiment}
                            </Badge>
                            {review.source === "google" && (
                              <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                                Google
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documentation">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Guide</CardTitle>
                  <CardDescription>
                    Step-by-step guide to implement Google Places API integration in production.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">1. Google Cloud Setup</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Create a Google Cloud Platform project</li>
                      <li>Enable the Places API in the API Library</li>
                      <li>Create an API key and restrict it to Places API</li>
                      <li>Set up IP restrictions for security</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2. Environment Configuration</h4>
                    <div className="bg-muted p-3 rounded-lg">
                      <code className="text-sm">GOOGLE_PLACES_API_KEY=your_api_key_here</code>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3. API Implementation</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      The API route handles Place ID validation, makes requests to Google Places API, and normalizes the
                      response format.
                    </p>
                    <div className="bg-muted p-3 rounded-lg">
                      <code className="text-sm">
                        GET /api/reviews/google?place_id=PLACE_ID&property_name=PROPERTY_NAME
                      </code>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">4. Attribution Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Display author names with links to their Google profiles</li>
                      <li>Include "Powered by Google" attribution</li>
                      <li>Show author profile photos when available</li>
                      <li>Maintain review text integrity (no modifications)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">5. Production Considerations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Implement caching to reduce API calls</li>
                      <li>Handle rate limiting gracefully</li>
                      <li>Monitor API usage and costs</li>
                      <li>Consider Google My Business API for more reviews</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Production Deployment</AlertTitle>
                <AlertDescription>
                  This demo uses mock data. In production, ensure you have proper API keys, error handling, and comply
                  with Google's Terms of Service and attribution requirements.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
