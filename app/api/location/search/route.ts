import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query parameter "q" is required and must be at least 2 characters' }, { status: 400 })
    }

    // Build the Nominatim API URL
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search')
    nominatimUrl.searchParams.set('q', query)
    nominatimUrl.searchParams.set('format', 'json')
    nominatimUrl.searchParams.set('addressdetails', '1')
    nominatimUrl.searchParams.set('limit', '15') // Get more results for broader matching
    nominatimUrl.searchParams.set('countrycodes', 'us,ca,gb,au,de,fr,es,it,nl')
    nominatimUrl.searchParams.set('featuretype', 'city')

    // Add a User-Agent header (required by Nominatim)
    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': 'ACS-Contact-Manager/1.0 (https://your-domain.com)',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Nominatim API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform and filter the data to match our expected format
    const transformedData = data
      .map((item: any) => {
        const city = (item.address?.city || item.address?.town || item.address?.village || item.name || '').trim()
        const state = (item.address?.state || '').trim()
        const country = (item.address?.country || '').trim()
        const fullAddress = (item.display_name || '').trim()
        
        // Only include results that have a valid city name
        if (!city || city.length === 0) return null
        
        // More flexible matching - allow partial matches at word boundaries
        const queryLower = query.toLowerCase()
        const cityLower = city.toLowerCase()
        
        // Check if the query matches at the beginning of the city name
        // or at the beginning of any word in the city name
        const cityWords = cityLower.split(/[\s\-_]+/)
        const hasMatch = cityLower.startsWith(queryLower) || 
                        cityWords.some(word => word.startsWith(queryLower))
        
        if (!hasMatch) {
          return null
        }
        
        return {
          uniqueKey: `${item.place_id}-${item.osm_id}`,
          city,
          state,
          country,
          fullAddress,
          lat: item.lat,
          lon: item.lon,
        }
      })
      .filter((item: any) => item !== null) // Remove null results
      .slice(0, 8); // Return more results for broader searches

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching location suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location suggestions' },
      { status: 500 }
    )
  }
} 