"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Code, Database, Palette, Globe, CheckCircle, XCircle, AlertTriangle, Server, Layers } from "lucide-react"
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
            displaying curated reviews on public-facing pages. Built with modern web technologies, MongoDB database integration,
            and designed for scalability and user experience.
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
              <h4 className="font-semibold text-brand-dark mb-2">Backend & Database</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Next.js API Routes
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  MongoDB
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Mongoose ODM
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Hostaway API
                </Badge>
                <Badge variant="secondary" className="bg-brand-sage text-brand-dark">
                  Google Places API
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

        {/* Database Architecture */}
        <Card className="mb-8 border-brand-sage">
          <CardHeader>
            <CardTitle className="flex items-center text-brand-dark">
              <Database className="mr-2 h-5 w-5" />
              Database Architecture
            </CardTitle>
            <CardDescription>MongoDB integration and data persistence strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-brand-dark mb-3">MongoDB Integration</h4>
              <div className="bg-brand-cream p-4 rounded-lg">
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Database:</strong> MongoDB with Mongoose ODM for data modeling
                </p>
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Connection:</strong> Centralized connection management in <code className="bg-white px-2 py-1 rounded text-brand-teal">lib/mongodb.ts</code>
                </p>
                <p className="text-sm text-brand-dark/80">
                  <strong>Schema:</strong> Comprehensive Review model with indexing and validation
                </p>
              </div>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Data Model</h4>
              <div className="bg-brand-cream p-4 rounded-lg">
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Review Schema:</strong> Normalized structure with all review data
                </p>
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Indexing:</strong> Optimized queries with compound indexes
                </p>
                <p className="text-sm text-brand-dark/80">
                  <strong>Validation:</strong> Type-safe data with Mongoose validation
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-brand-dark/80">
                <li>• Unique external_id for deduplication</li>
                <li>• Source tracking (hostaway, google, manual)</li>
                <li>• Approval workflow with audit trail</li>
                <li>• Sentiment analysis and categorization</li>
              </ul>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Data Ingestion Strategy</h4>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Automatic data seeding when database is empty</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Manual sync triggers via API endpoints</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Deduplication based on external_id</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Real-time data transformation and normalization</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* API Architecture */}
        <Card className="mb-8 border-brand-sage">
          <CardHeader>
            <CardTitle className="flex items-center text-brand-dark">
              <Server className="mr-2 h-5 w-5" />
              API Architecture
            </CardTitle>
            <CardDescription>Single source of truth with modular helper functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Single Source of Truth</h4>
              <div className="bg-brand-cream p-4 rounded-lg">
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Main Endpoint:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded text-brand-teal">/api/reviews/hostaway</code>
                </p>
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>CRUD Operations:</strong> GET, POST, PATCH, DELETE all in one endpoint
                </p>
                <p className="text-sm text-brand-dark/80">
                  <strong>Features:</strong> Filtering, pagination, sorting, and optional summary statistics
                </p>
              </div>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Helper Functions Architecture</h4>
              <div className="space-y-3">
                <div className="p-4 bg-brand-cream rounded-lg">
                  <h5 className="font-medium text-brand-dark mb-2">lib/hostaway/data.ts</h5>
                  <p className="text-sm text-brand-dark/80 mb-2">Mock data and normalization functions</p>
                  <ul className="text-sm text-brand-dark/80 space-y-1">
                    <li>• Mock Hostaway reviews data</li>
                    <li>• Data normalization logic</li>
                    <li>• Type definitions</li>
                  </ul>
                </div>
                <div className="p-4 bg-brand-cream rounded-lg">
                  <h5 className="font-medium text-brand-dark mb-2">lib/hostaway/database.ts</h5>
                  <p className="text-sm text-brand-dark/80 mb-2">Database operations and utilities</p>
                  <ul className="text-sm text-brand-dark/80 space-y-1">
                    <li>• MongoDB connection and queries</li>
                    <li>• Data transformation functions</li>
                    <li>• Summary generation logic</li>
                  </ul>
                </div>
                <div className="p-4 bg-brand-cream rounded-lg">
                  <h5 className="font-medium text-brand-dark mb-2">lib/hostaway/utils.ts</h5>
                  <p className="text-sm text-brand-dark/80 mb-2">Utility functions and helpers</p>
                  <ul className="text-sm text-brand-dark/80 space-y-1">
                    <li>• Avatar generation</li>
                    <li>• Sentiment analysis</li>
                    <li>• Data validation</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">API Endpoints</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">Primary CRUD Endpoint</p>
                  <p className="text-sm text-green-700">
                    <code>/api/reviews/hostaway</code> - All review operations with query parameters
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Google Integration</p>
                  <p className="text-sm text-blue-700">
                    <code>/api/reviews/google</code> - Google Places API integration
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-1">Combined Views</p>
                  <p className="text-sm text-purple-700">
                    <code>/api/reviews/combined</code> - Multi-source review aggregation
                  </p>
                </div>
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
                    <strong>Single Source of Truth:</strong> All CRUD operations centralized in hostaway endpoint
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Modular Helper Functions:</strong> Clean separation of concerns with extracted utilities
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Type Safety:</strong> Comprehensive TypeScript interfaces for all data structures
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Database-First Approach:</strong> MongoDB integration for persistent data storage
                  </span>
                </li>
              </ul>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-2">Data Management Strategy</h4>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Hybrid Summary Approach:</strong> Server-generated summaries with client-side analytics
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Service Layer:</strong> Centralized API calls through ReviewService
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Automatic Data Ingestion:</strong> Smart seeding when database is empty
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Consistent Data Format:</strong> Unified review structure across all sources
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
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Real-time Updates:</strong> Immediate feedback for approval actions
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
              <Layers className="mr-2 h-5 w-5" />
              API Behaviors & Features
            </CardTitle>
            <CardDescription>How the application handles data fetching and API integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Main API Endpoint</h4>
              <div className="bg-brand-cream p-4 rounded-lg">
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Endpoint:</strong>{" "}
                  <code className="bg-white px-2 py-1 rounded text-brand-teal">/api/reviews/hostaway</code>
                </p>
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Methods:</strong> GET, POST, PATCH, DELETE with comprehensive query parameters
                </p>
                <p className="text-sm text-brand-dark/80">
                  <strong>Features:</strong> Pagination, filtering, sorting, summary statistics, and data ingestion
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-brand-dark/80">
                <li>• Automatic data seeding when database is empty</li>
                <li>• Optional summary statistics with <code>?summary=true</code></li>
                <li>• Flexible filtering by rating, channel, approval status, etc.</li>
                <li>• Real-time approval workflow with audit trail</li>
                <li>• Deduplication based on external_id</li>
              </ul>
            </div>

            <Separator className="bg-brand-sage" />

            <div>
              <h4 className="font-semibold text-brand-dark mb-3">Service Layer Integration</h4>
              <div className="bg-brand-cream p-4 rounded-lg">
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>ReviewService:</strong> Centralized API interaction layer
                </p>
                <p className="text-sm text-brand-dark/80 mb-2">
                  <strong>Methods:</strong> fetchReviews, fetchDashboardReviews, fetchPublicReviews, approveReviews
                </p>
                <p className="text-sm text-brand-dark/80">
                  <strong>Features:</strong> Type-safe responses, error handling, and automatic data syncing
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
                  <span>Database connection pooling and optimization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Optimistic updates for better perceived performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-4 w-4 text-brand-teal mt-0.5 flex-shrink-0" />
                  <span>Automatic retry logic for failed operations</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Google Reviews Integration */}
        <Card className="mb-8 border-brand-sage">
          <CardHeader>
            <CardTitle className="flex items-center text-brand-dark">
              <Globe className="mr-2 h-5 w-5" />
              Google Reviews Integration
            </CardTitle>
            <CardDescription>Google Places API integration and multi-source review aggregation</CardDescription>
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
                  <span className="text-sm font-medium text-green-800">Combined Views</span>
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
              <h4 className="font-semibold text-brand-dark mb-3">Multi-Source Strategy</h4>
              <div className="space-y-3">
                <div className="p-4 bg-brand-cream rounded-lg">
                  <h5 className="font-medium text-brand-dark mb-2">Primary Source: Hostaway</h5>
                  <p className="text-sm text-brand-dark/80 mb-2">
                    Main review management system with full CRUD capabilities:
                  </p>
                  <ul className="text-sm text-brand-dark/80 space-y-1">
                    <li>• Complete review lifecycle management</li>
                    <li>• Approval workflow and audit trail</li>
                    <li>• Comprehensive analytics and reporting</li>
                    <li>• Database persistence and data integrity</li>
                  </ul>
                </div>
                <div className="p-4 bg-brand-cream rounded-lg">
                  <h5 className="font-medium text-brand-dark mb-2">Supplementary: Google Places</h5>
                  <p className="text-sm text-brand-dark/80 mb-2">
                    Social proof and additional review sources:
                  </p>
                  <ul className="text-sm text-brand-dark/80 space-y-1">
                    <li>• Public review aggregation</li>
                    <li>• Enhanced social credibility</li>
                    <li>• Cross-platform review visibility</li>
                    <li>• SEO and discoverability benefits</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-brand-sage">
          <p className="text-brand-dark/60 mb-4">
            This documentation covers the key aspects of the Flex Living Reviews Dashboard implementation with MongoDB integration.
          </p>
          <Link href="/dashboard">
            <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white">Open Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
