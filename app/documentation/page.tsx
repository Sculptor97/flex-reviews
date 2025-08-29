"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Code, Database, Palette, Globe, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-brand-sage bg-white">
        <div className="flex h-16 items-center px-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-brand-dark">Reviews Dashboard Documentation</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-4">Flex Living Reviews Dashboard</h1>
          <p className="text-lg text-brand-dark/80 leading-relaxed">
            A comprehensive property management solution for analyzing guest reviews, managing approval workflows, and
            displaying curated reviews on public-facing pages. Built with modern web technologies and designed for
            scalability and user experience.
          </p>
        </div>

        {/* Tech Stack */}
        <Card className="mb-8 border-brand-sage">
          <CardHeader>
            <CardTitle className="flex items-center text-brand-dark">
              <Code className="mr-2 h-5 w-5" />
              Tech Stack
            </CardTitle>
            <CardDescription>Technologies and frameworks used in this project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-brand-dark mb-2">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Next.js 15
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  React 18
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  TypeScript
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Tailwind CSS v4
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  shadcn/ui
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Recharts
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-brand-dark mb-2">Backend & APIs</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Next.js API Routes
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Hostaway API
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Google Places API
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  SWR
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-brand-dark mb-2">Development Tools</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  ESLint
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Prettier
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Geist Font
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Design Decisions */}
        <Card className="mb-8 border-brand-sage">
          <CardHeader>
            <CardTitle className="flex items-center text-brand-dark">
              <Palette className="mr-2 h-5 w-5" />
              Key Design & Logic Decisions
            </CardTitle>
            <CardDescription>Architecture and design choices that shape the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-brand-dark mb-2">Architecture Patterns</h4>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Separation of Concerns:</strong> Extracted business logic into utility functions, custom
                    hooks, and service layers
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Modular Components:</strong> Reusable UI components with consistent design system
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Type Safety:</strong> Comprehensive TypeScript interfaces for all data structures
                  </span>
                </li>
              </ul>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-2">User Experience Design</h4>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Collapsible Sidebar:</strong> Space-efficient navigation with icon-only collapsed state
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Horizontal Filters:</strong> Intuitive filter placement at page top rather than sidebar
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Minimal Color Palette:</strong> Clean white-based design with strategic accent colors
                  </span>
                </li>
              </ul>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-2">Data Management</h4>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Data Normalization:</strong> Unified review format across multiple sources (Hostaway,
                    Google)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Client-Side Caching:</strong> SWR for efficient data fetching and state management
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Mock Data Strategy:</strong> Realistic sample data for development and testing
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* API Behaviors */}
        <Card className="mb-8 border-brand-sage">
          <CardHeader>
            <CardTitle className="flex items-center text-brand-dark">
              <Database className="mr-2 h-5 w-5" />
              API Behaviors
            </CardTitle>
            <CardDescription>How the application handles data fetching and API integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Hostaway Integration</h4>
              <div className="bg-brand-cream p-4 rounded-lg">
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Endpoint:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded text-brand-teal">/api/reviews/hostaway</code>
                </p>
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Method:</strong> GET with query parameters for filtering
                </p>
                <p className="text-sm text-brand-dark/80">
                  <strong>Features:</strong> Pagination, filtering by rating/channel/date, sorting, and data
                  normalization
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-brand-dark/80">
                <li>• Normalizes review data into consistent format</li>
                <li>• Handles missing or malformed data gracefully</li>
                <li>• Provides summary statistics and metadata</li>
                <li>• Supports advanced filtering and sorting options</li>
              </ul>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Combined Reviews API</h4>
              <div className="bg-brand-cream p-4 rounded-lg">
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Endpoint:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded text-brand-teal">/api/reviews/combined</code>
                </p>
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Method:</strong> GET - Merges Hostaway and Google reviews
                </p>
                <p className="text-sm text-brand-dark/80">
                  <strong>Features:</strong> Unified data format, source attribution, and combined analytics
                </p>
              </div>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Error Handling & Performance</h4>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Graceful error handling with user-friendly messages</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Loading states and skeleton components for better UX</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Client-side caching to reduce API calls</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Optimistic updates for better perceived performance</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Google Reviews Findings */}
        <Card className="mb-8 border-brand-sage">
          <CardHeader>
            <CardTitle className="flex items-center text-brand-dark">
              <Globe className="mr-2 h-5 w-5" />
              Google Reviews Integration Findings
            </CardTitle>
            <CardDescription>Research and implementation results for Google Places API integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Implementation Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">API Integration Complete</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Data Normalization</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Demo Implementation</span>
                </div>
              </div>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Key Limitations & Considerations</h4>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">Limited Review Count</p>
                    <p className="text-sm text-yellow-700">
                      Google Places API returns maximum 5 "relevant" reviews per location
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="mr-2 h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Attribution Requirements</p>
                    <p className="text-sm text-blue-700">
                      Must display author names, profile links, and photo attributions
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="mr-2 h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 mb-1">No Pagination Support</p>
                    <p className="text-sm text-red-700">
                      Cannot retrieve more than 5 reviews or paginate through results
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Alternative Solutions</h4>
              <div className="space-y-3">
                <div className="p-4 bg-brand-cream rounded-lg">
                  <h5 className="font-medium text-brand-dark mb-2">Google My Business API</h5>
                  <p className="text-sm text-brand-dark/80 mb-2">
                    Provides access to all reviews (up to 50 per page) but requires:
                  </p>
                  <ul className="text-sm text-brand-dark/80 space-y-1">
                    <li>• Business ownership verification</li>
                    <li>• 2-4 weeks approval process</li>
                    <li>• More complex authentication flow</li>
                  </ul>
                </div>
                <div className="p-4 bg-brand-cream rounded-lg">
                  <h5 className="font-medium text-brand-dark mb-2">Third-Party Services</h5>
                  <p className="text-sm text-brand-dark/80">
                    Services like Featurable API offer embeddable widgets with more reviews but require business
                    ownership and additional costs.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Recommendations</h4>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Use Google Places API for basic integration and social proof</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Consider Google My Business API for comprehensive review management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Implement proper attribution and comply with Google's display requirements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Focus on Hostaway as primary source with Google as supplementary</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-brand-sage">
          <p className="text-brand-dark/60 mb-4">
            This documentation covers the key aspects of the Flex Living Reviews Dashboard implementation.
          </p>
          <Link href="/dashboard">
            <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white">Open Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
