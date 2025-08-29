import { NextResponse } from "next/server"

// Combined API route that fetches and merges reviews from multiple sources
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get("property_id")
    const placeId = searchParams.get("place_id")
    const includeGoogle = searchParams.get("include_google") === "true"

    // Fetch Hostaway reviews
    const hostawayResponse = await fetch(
      `${request.url.split("/api")[0]}/api/reviews/hostaway?property_id=${propertyId || ""}`,
    )
    const hostawayData = await hostawayResponse.json()

    let combinedReviews = hostawayData.success ? hostawayData.data.reviews : []
    let combinedSummary = hostawayData.success ? hostawayData.data.summary : { totalReviews: 0, averageRating: 0 }

    // Fetch Google reviews if requested and place_id is provided
    if (includeGoogle && placeId) {
      try {
        const googleResponse = await fetch(
          `${request.url.split("/api")[0]}/api/reviews/google?place_id=${placeId}&property_name=${encodeURIComponent("Flex Living Property")}`,
        )
        const googleData = await googleResponse.json()

        if (googleData.success) {
          // Merge reviews
          combinedReviews = [...combinedReviews, ...googleData.data.reviews]

          // Recalculate combined summary
          const totalReviews = combinedReviews.length
          const averageRating =
            totalReviews > 0
              ? combinedReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews
              : 0

          const channelBreakdown = combinedReviews.reduce((acc: any, review: any) => {
            acc[review.channel] = (acc[review.channel] || 0) + 1
            return acc
          }, {})

          const sentimentBreakdown = combinedReviews.reduce(
            (acc: any, review: any) => {
              acc[review.sentiment] = (acc[review.sentiment] || 0) + 1
              return acc
            },
            { positive: 0, neutral: 0, negative: 0 },
          )

          combinedSummary = {
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            channelBreakdown,
            sentimentBreakdown,
            sources: {
              hostaway: hostawayData.data?.summary?.totalReviews || 0,
              google: googleData.data?.summary?.totalReviews || 0,
            },
          }
        }
      } catch (googleError) {
        console.warn("Failed to fetch Google reviews:", googleError)
        // Continue with just Hostaway reviews
      }
    }

    // Sort combined reviews by date (most recent first)
    combinedReviews.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      success: true,
      data: {
        reviews: combinedReviews,
        summary: combinedSummary,
      },
      meta: {
        timestamp: new Date().toISOString(),
        sources: includeGoogle && placeId ? ["hostaway", "google"] : ["hostaway"],
        integration: {
          hostaway: "active",
          google: includeGoogle && placeId ? "active" : "disabled",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching combined reviews:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch combined reviews",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
