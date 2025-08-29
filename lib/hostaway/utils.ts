// Utility function to generate avatar URL
export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=284E4C&color=fff`
}

// Utility function to determine sentiment from rating
export function getSentimentFromRating(rating: number): "positive" | "neutral" | "negative" {
  if (rating >= 4) return "positive"
  if (rating <= 2) return "negative"
  return "neutral"
}

// Utility function to auto-approve reviews based on rating
export function shouldAutoApprove(rating: number): boolean {
  return rating >= 4
}

// Utility function to validate review data
export function validateReviewData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.external_id) errors.push("external_id is required")
  if (!data.property_name) errors.push("property_name is required")
  if (!data.guest_name) errors.push("guest_name is required")
  if (!data.rating || data.rating < 1 || data.rating > 5) errors.push("rating must be between 1 and 5")
  if (!data.comment) errors.push("comment is required")
  if (!data.channel) errors.push("channel is required")

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Utility function to format date for display
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Utility function to truncate text
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}
