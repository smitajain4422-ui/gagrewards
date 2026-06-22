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

  // Grab the actual user's IP and Device Type from the request headers
  const userIp = request.headers.get("x-forwarded-for") || ""
  const userAgent = request.headers.get("user-agent") || ""

  // Private AdBlueMedia API URL (Appending the user IP and Agent)
  const ADBLUE_URL = `https://d1cdbd1x576ga0.cloudfront.net/public/offers/feed.php?user_id=779217&api_key=45665e45f6e0cc2e67c90724cfedcfe8&s1=${s1}&s2=${s2}&ip=${userIp}&user_agent=${encodeURIComponent(userAgent)}`

  try {
    // Pass the headers directly in the fetch request to ensure AdBlueMedia registers the true IP
    const res = await fetch(ADBLUE_URL, {
      headers: {
        "X-Forwarded-For": userIp,
        "User-Agent": userAgent
      }
    })
    
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from provider" }, { status: res.status })
    }
    const data = await res.json()

    // Trim to 5 offers
    const rawOffers = Array.isArray(data) ? data.slice(0, 5) : []

    // Map AdBlueMedia's schema
    const mappedOffers = rawOffers.map((offer: any, index: number) => {
      // FIX: Prioritize 'offer.name' (Actual internal campaign name) over 'anchor' or 'title'
      const rawName = offer.name || offer.title || offer.anchor || "Complete Offer"
      
      // Use 'conversion' first for the description, as it usually has the direct instructions (e.g., "Complete survey")
      const rawDesc = offer.conversion || offer.description || "Follow the instructions to complete."

      return {
        id: offer.offer_id?.toString() || index.toString(),
        name: cleanText(rawName), 
        description: cleanText(rawDesc), 
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
        
