"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EVChargingApp() {
  const [userLocation, setUserLocation] = useState(null)
  const [stations, setStations] = useState([])
  const [algorithmResults, setAlgorithmResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [address, setAddress] = useState("")
  const [distance, setDistance] = useState("");
  // Get user's current location
  async function getCurrentLocation() {
    setLoading(true)
    setError("")

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        })
      })

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      setUserLocation(location)
      await findStationsAndAnalyze(location,distance)
    } catch (err) {
      setError("Could not get your location. Please enter an address manually.")
    }
    setLoading(false)
  }

  // Search for address
  async function searchAddress() {
    if (!address.trim()) {
      setError("Please enter an address")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address.trim())}`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      const location = { lat: data.lat, lng: data.lng }
      setUserLocation(location)
      await findStationsAndAnalyze(location,distance)
    } catch (err) {
      setError("Failed to search address. Please try again.")
    }
    setLoading(false)
  }

  // Find stations and run algorithm analysis
  async function findStationsAndAnalyze(location,distance) {
    setError("")
    try {
      console.log("🔍 Finding stations and running algorithms...")

      // Step 1: Find nearby charging stations
      const stationsResponse = await fetch(`/api/stations?lat=${location.lat}&lng=${location.lng}&distance=${distance || 25}`)

      if (!stationsResponse.ok) {
        const msg = await stationsResponse.text()
        setError(msg || "Failed to find stations")
        return
      }

      const stationsData = await stationsResponse.json()

      if (stationsData.error) {
        setError(stationsData.error)
        return
      }

      const foundStations = stationsData.stations || []
      setStations(foundStations)

      // Step 2: Run multiple algorithms to find best station
      if (foundStations.length > 0) {
        console.log("🤖 Running multiple algorithms...")

        const algorithmResponse = await fetch("/api/find-best-station", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userLocation: location,
            stations: foundStations,
          }),
        })

        if (algorithmResponse.ok) {
          const algorithmData = await algorithmResponse.json()
          setAlgorithmResults(algorithmData)
          console.log("✅ Algorithm analysis complete!")
        }
      }
    } catch (err) {
      console.error("Analysis error:", err)
      setError("Failed to analyze stations. Please try again.")
    }
  }

  // Open Google Maps for directions
  function openDirections(station) {
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${station.lat},${station.lng}`
    window.open(url, "_blank")
  }

  // Handle Enter key press
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      searchAddress()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🧠 Multi-Algorithm EV Station Finder</h1>
          <p className="text-gray-600">
            Using Dijkstra's, A*, Genetic Algorithm & Machine Learning to find the perfect station
          </p>
        </div>

        {/* Location Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📍 Your Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={getCurrentLocation} disabled={loading} className="w-full">
              {loading ? "Getting Location..." : "Use Current Location"}
            </Button>

            <div className="flex gap-2">
              <Input
                placeholder="Or enter address (e.g., San Francisco, CA)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Input
                placeholder="Enter the distance in km (optional)"
                value={distance}
                onChange={(e) => setDistance((e.target.value))}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={searchAddress} disabled={loading || !address.trim() } className="w-32">
                Search
              </Button>
            </div>

            {userLocation && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200">
            <CardContent className="pt-6">
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">❌ {error}</div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Running multiple algorithms to find the best station...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Algorithm Results */}
        {algorithmResults && (
          <div className="space-y-6 mb-6">
            {/* Best Station Winner */}
            <Card className="border-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">🏆 Algorithm Selection</CardTitle>
                <p className="text-sm text-green-600">{algorithmResults.explanation.consensus}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{algorithmResults.bestStation.name}</h3>
                    <p className="text-gray-600">{algorithmResults.bestStation.address}</p>
                  </div>
                  <Button onClick={() => openDirections(algorithmResults.bestStation)} className="w-full">
                    🗺️ Get Directions to the Selected EV Charger
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>🧠 Algorithm Comparison</CardTitle>
                <p className="text-sm text-gray-600">See how different algorithms chose different stations</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {algorithmResults.explanation.details.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{result.algorithm}</h4>
                        <Badge variant={result.choice === algorithmResults.bestStation.name ? "default" : "outline"}>
                          Score: {result.score}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">Chose: {result.choice}</p>
                      <p className="text-xs text-gray-600">{result.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Stations List */}
        {stations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📋 All Nearby Stations ({stations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stations.map((station, index) => (
                  <div
                    key={station.id || index}
                    className={`p-4 border rounded-lg ${
                      algorithmResults && algorithmResults.bestStation.name === station.name
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {station.name}
                          {algorithmResults && algorithmResults.bestStation.name === station.name && (
                            <Badge className="ml-2 bg-green-600">ALGORITHM CHOSEN STATION</Badge>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm">{station.address}</p>
                        <p className="text-gray-500 text-sm mt-1">📍 {station.distance}</p>
                      </div>
                    </div>
                    <Button onClick={() => openDirections(station)} size="sm" className="w-full">
                      🗺️ Get Directions
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>🧠 Powered by 4 different algorithms: Dijkstra's, A*, Genetic Algorithm & Machine Learning</p>
        </div>
        <div className="text-center mt-2 text-sm text-gray-500">
          <p>Made by Royston Akash Dsouza</p>
        </div>
      </div>
    </div>
  )
}
