import { NextResponse } from "next/server"

// Helper to clean up annoying HTML entities from AdBlueMedia
function cleanText(text: string) {
  if (!text) return ""
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const s1 = searchParams.get("s1") || ""
  const s2 = searchParams.get("s2") || ""

  // Private AdBlueMedia API URL
  const ADBLUE_URL = `https://d1cdbd1x576ga0.cloudfront.net/public/offers/feed.php?user_id=779217&api_key=45665e45f6e0cc2e67c90724cfedcfe8&s1=${s1}&s2=${s2}`

  try {
    const res = await fetch(ADBLUE_URL)
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from provider" }, { status: res.status })
    }
    const data = await res.json()

    // Trim to 5 offers as per your jQuery logic
    const rawOffers = Array.isArray(data) ? data.slice(0, 5) : []

    // Map AdBlueMedia's schema to your Offerwall component's expected schema
    const mappedOffers = rawOffers.map((offer: any, index: number) => {
      // Grab the best available text fields
      const rawName = offer.title || offer.name || offer.anchor || "Complete Offer"
      const rawDesc = offer.description || offer.conversion || "Follow the instructions to complete."

      return {
        id: offer.offer_id?.toString() || index.toString(),
        name: cleanText(rawName), // This removes the &nbsp;
        description: cleanText(rawDesc), // This removes the &nbsp;
        payout: offer.points || 0,
        picture: offer.image_url || offer.picture || "",
        url: offer.url,
      }
    })

    return NextResponse.json({ offers: mappedOffers })
  } catch (error) {
    console.error("Failed to fetch AdBlueMedia offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
                                    }
      
