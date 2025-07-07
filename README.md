# ⚡ Smart EV Charging Finder

A CS student project that helps electric vehicle owners find the best charging stations using intelligent route optimization algorithms.

## 🎯 Project Overview

This application goes beyond simple "find nearest station" - it uses a smart algorithm to recommend the **truly best** charging station by considering:

- **Distance** - How far you need to travel
- **Travel Time** - Actual driving time with traffic
- **Station Quality** - Network reliability and charging speed
- **Route Optimization** - Multi-factor scoring algorithm

## 🚀 Key Features

### Smart Algorithm
- **Multi-Factor Analysis** - Considers distance, time, and quality
- **Real Route Calculation** - Uses TomTom routing API for accurate travel times
- **Intelligent Scoring** - Weighted scoring system (40% distance, 30% time, 30% quality)
- **Network Recognition** - Bonus points for reliable networks (Tesla, Electrify America, etc.)

### User Experience
- **Location Detection** - GPS or manual address input
- **Best Route Recommendation** - Clear recommendation with reasoning
- **All Stations View** - Complete list sorted by distance
- **Google Maps Integration** - Direct navigation to chosen station

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with React (simple but modern)
- **Backend**: Next.js API routes with routing algorithms
- **APIs**: TomTom Maps for geocoding, places, and routing
- **Styling**: Tailwind CSS (clean and responsive)
- **Algorithm**: Custom multi-factor optimization

## 📋 How to Run

1. **Prerequisites**
   - Node.js 18+
   - TomTom API key (already configured in environment)

2. **Installation**
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`

3. **Usage**
   - Open http://localhost:3000
   - Allow location access or enter address
   - Get intelligent station recommendations

## 🧠 The Algorithm Explained

### Step 1: Data Collection
\`\`\`
1. Get user location (GPS or geocoding)
2. Find nearby EV charging stations (TomTom Places API)
3. Calculate actual routes to each station (TomTom Routing API)
\`\`\`

### Step 2: Multi-Factor Scoring
\`\`\`
For each station:
  Distance Score (0-40 points):
    - Start with 40 points
    - Subtract 2 points per kilometer
    
  Time Score (0-30 points):
    - Start with 30 points  
    - Subtract 0.5 points per minute
    
  Quality Score (0-30 points):
    - Tesla/Supercharger: 30 points
    - Electrify America: 28 points
    - ChargePoint: 25 points
    - EVgo: 22 points
    - Fast charging: 20 points
    - Others: 15 points
\`\`\`

### Step 3: Optimization
\`\`\`
1. Calculate total score for each station
2. Sort by highest score (best option first)
3. Return recommendation with explanation
\`\`\`

## 📊 Algorithm Performance

The algorithm considers real-world factors:

- **Not just distance** - A station 2km further might be better if it's faster to reach
- **Network reliability** - Tesla Superchargers score higher than unknown networks  
- **Traffic conditions** - Uses real-time routing data
- **Balanced scoring** - No single factor dominates the decision

## 🎓 Student Learning Outcomes

This project demonstrates:

1. **Algorithm Design** - Multi-factor optimization problem
2. **API Integration** - Real-world data from TomTom
3. **Full-Stack Development** - Frontend + Backend + Database concepts
4. **Problem Solving** - Beyond simple distance calculations
5. **User Experience** - Clean, intuitive interface

## 🔍 Code Structure

\`\`\`
app/
├── page.tsx                 # Main React component (frontend)
├── api/
│   ├── geocode/route.ts     # Address to coordinates
│   ├── stations/route.ts    # Find nearby stations  
│   └── best-route/route.ts  # Smart routing algorithm
components/ui/               # Reusable UI components
README.md                    # This file
\`\`\`

## 🚀 Future Enhancements

- [ ] **Machine Learning** - Learn from user preferences
- [ ] **Real-time Data** - Live station availability
- [ ] **Multi-stop Routes** - Plan trips with multiple charging stops
- [ ] **Cost Optimization** - Include charging prices in algorithm
- [ ] **Mobile App** - React Native version (Future Scope)

## 🎯 Why This Algorithm Works

Traditional apps just show "nearest stations" - but nearest isn't always best:

- **Scenario 1**: Station A is 5km away, Station B is 7km away, but B is on a highway (faster)
- **Scenario 2**: Station C is closest but unreliable, Station D is slightly further but Tesla
- **Our Algorithm**: Considers all factors and picks the truly optimal choice

## 📝 Academic Notes

This project satisfies final year requirements by demonstrating:

- **Algorithm complexity** - O(n log n) sorting with O(n) API calls
- **Real-world application** - Solves actual EV owner problems  
- **Technical depth** - Multi-factor optimization with external APIs
- **Code quality** - Clean, documented, maintainable code
- **User focus** - Intuitive interface with clear explanations

---

**Made with ❤️ by a CS student - simple code, smart algorithms! 🎓**
