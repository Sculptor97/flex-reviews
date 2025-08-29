import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const { reviewIds, approved, approvedBy } = await request.json()

    if (!reviewIds || !Array.isArray(reviewIds)) {
      return NextResponse.json({ success: false, error: "Review IDs are required" }, { status: 400 })
    }

    // Update approval status in database
    const { data, error } = await supabase
      .from("reviews")
      .update({
        approved,
        approved_by: approvedBy || "Manager",
        approved_at: approved ? new Date().toISOString() : null,
      })
      .in("id", reviewIds)
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to update reviews" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        updatedReviews: data,
        message: `${reviewIds.length} review(s) ${approved ? "approved" : "unapproved"} successfully`,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
