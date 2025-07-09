import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const distance = searchParams.get("distance") || "25" // Default to 25 km if not provided

    if (!lat || !lng) {
      return NextResponse.json({ error: "Coordinates required" }, { status: 400 })
    }

    const apiKey = process.env.TOMTOM_API_KEY
    if (!apiKey) {
      console.error("❌ TomTom API key not found")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    console.log("🔍 Searching stations near:", lat, lng)

    // Search for EV charging stations
    const url = `https://api.tomtom.com/search/2/nearbySearch/.json?key=${apiKey}&lat=${lat}&lon=${lng}&radius=${distance}000&categorySet=7309&limit=10`

    const response = await fetch(url)

    if (!response.ok) {
      console.error("❌ Stations search failed:", response.status)
      return NextResponse.json({ error: "Failed to find charging stations" }, { status: 500 })
    }

    const data = await response.json()
    console.log("📊 Found", data.results?.length || 0, "stations")

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: "No charging stations found in this area" }, { status: 404 })
    }

    // Process and enhance station data
    const stations = data.results.map((result: any, index: number) => {
      const distance = calculateDistance(
        Number.parseFloat(lat),
        Number.parseFloat(lng),
        result.position.lat,
        result.position.lon,
      )

      return {
        id: `station_${index}`,
        name: result.poi?.name || "EV Charging Station",
        address: result.address?.freeformAddress || "Address not available",
        lat: result.position.lat,
        lng: result.position.lon,
        distance: `${distance.toFixed(1)} km`,
        distanceKm: distance,
        phone: result.poi?.phone || null,
      }
    })

    // Sort by distance (closest first)
    stations.sort((a, b) => a.distanceKm - b.distanceKm)

    console.log("✅ Returning", stations.length, "processed stations")
    return NextResponse.json({ stations })
  } catch (error) {
    console.error("💥 Stations search error:", error)
    return NextResponse.json({ error: "Failed to find charging stations" }, { status: 500 })
  }
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
