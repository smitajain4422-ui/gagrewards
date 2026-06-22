import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Your private Discord Webhook URL
    const discordWebhookUrl = "https://discord.com/api/webhooks/1508497538917859420/pm7TlQZXQ73RUBr6WVzTp4uAgfudb1ODnv-ALuJeDjNcWedwUETnHBqDwMt9OIWMgVEM"

    await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Discord Webhook Failed:", error)
    return NextResponse.json({ error: "Failed to send webhook" }, { status: 500 })
  }
}
