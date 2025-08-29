"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, MessageSquare, CheckCircle, Star, Globe, Code } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-card-foreground">Flex Living</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/documentation">
              <Button variant="outline">
                <Code className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </Link>
            <Link href="/reviews">
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" />
                View Reviews
              </Button>
            </Link>
            <Link href="/google-integration">
              <Button variant="outline">
                <Globe className="mr-2 h-4 w-4" />
                Google Integration
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button>
                Manager Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">Reviews Dashboard for Property Managers</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your review management process with powerful analytics, filtering capabilities, and approval
            workflows designed for Flex Living properties.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/dashboard">
              <Button size="lg">
                Open Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reviews">
              <Button size="lg" variant="outline">
                <Star className="mr-2 h-5 w-5" />
                View Public Reviews
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-16 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Powerful Review Management Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Comprehensive analytics with rating distributions, sentiment analysis, and channel performance
                  metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Review Management</CardTitle>
                <CardDescription>
                  Advanced filtering, bulk actions, and approval workflows to efficiently manage reviews across all
                  properties.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-accent mb-2" />
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Seamless integration with Hostaway API, data normalization, and real-time synchronization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Google Reviews</CardTitle>
                <CardDescription>
                  Integrate Google Places API to combine reviews from multiple sources for comprehensive coverage.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
