import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address || address.trim().length === 0) {
      return NextResponse.json({ error: "Please enter an address" }, { status: 400 })
    }

    const apiKey = process.env.TOMTOM_API_KEY
    if (!apiKey) {
      console.error("❌ TomTom API key not found in environment")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const cleanAddress = address.trim()
    console.log("🔍 Geocoding:", cleanAddress)

    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(cleanAddress)}.json?key=${apiKey}&limit=1`

    const response = await fetch(url)

    if (!response.ok) {
      console.error("❌ TomTom geocoding failed:", response.status)
      return NextResponse.json({ error: "Address search failed" }, { status: 500 })
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: `Address "${cleanAddress}" not found. Try a city name like "New York" or "Los Angeles"` },
        { status: 404 },
      )
    }

    const result = data.results[0]
    console.log("✅ Geocoded successfully:", result.position)

    return NextResponse.json({
      lat: result.position.lat,
      lng: result.position.lon,
      address: result.address.freeformAddress,
    })
  } catch (error) {
    console.error("💥 Geocoding error:", error)
    return NextResponse.json({ error: "Failed to search address" }, { status: 500 })
  }
}
