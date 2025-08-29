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
        <div className="flex flex-col sm:flex-row h-auto sm:h-16 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-0">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-card-foreground">Flex Living</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto sm:ml-auto">
            <Link href="/documentation" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-sm">
                <Code className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Documentation</span>
                <span className="sm:hidden">Docs</span>
              </Button>
            </Link>
            <Link href="/reviews" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-sm">
                <Star className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">View Reviews</span>
                <span className="sm:hidden">Reviews</span>
              </Button>
            </Link>
            <Link href="/google-integration" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-sm">
                <Globe className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Google Integration</span>
                <span className="sm:hidden">Google</span>
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-brand-teal text-brand-cream hover:bg-brand-cream hover:text-brand-teal text-sm">
                <span className="hidden sm:inline">Manager Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Reviews Dashboard for Property Managers</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your review management process with powerful analytics, filtering capabilities, and approval
            workflows designed for Flex Living properties.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:space-x-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-brand-teal text-brand-cream hover:bg-brand-cream hover:text-brand-teal">
                Open Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reviews" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
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
                <BarChart3 className="h-8 w-8 text-brand-teal mb-2" />
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Comprehensive analytics with rating distributions, sentiment analysis, and channel performance
                  metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-brand-teal mb-2" />
                <CardTitle>Review Management</CardTitle>
                <CardDescription>
                  Advanced filtering, bulk actions, and approval workflows to efficiently manage reviews across all
                  properties.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-brand-teal mb-2" />
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Seamless integration with Hostaway API, data normalization, and real-time synchronization.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-brand-teal mb-2" />
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
