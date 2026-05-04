
/**
 * Maps Service for handling Google Maps API requests
 */

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export interface TransitRouteResult {
  id: string;
  distance: number; // km
  duration: number; // minutes
  busLine?: string;
  departureTime?: string;
  arrivalTime?: string;
  stops: Array<{
    name: string;
    lat: number;
    lng: number;
    order: number;
    type?: string;
    details?: string;
  }>;
}

export interface TransitResponse extends TransitRouteResult {
  routes: TransitRouteResult[];
}

export const mapsService = {
  /**
   * Fetches bus transit directions between two points
   */
  getBusTransitDirections: async (origin: string, destination: string): Promise<TransitResponse> => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API Key missing. Using mock data for demonstration.");
      return mockTransitData(origin, destination);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=transit&transit_mode=bus&alternatives=true&key=${GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK") {
        console.warn(`Google Maps API returned ${data.status}. Falling back to mock data.`);
        return mockTransitData(origin, destination);
      }

      const parsedRoutes: TransitRouteResult[] = data.routes.map((route: any, index: number) => {
        const leg = route.legs[0];
        const distance = leg.distance.value / 1000;
        const duration = Math.round(leg.duration.value / 60);
        const departureTime = leg.departure_time?.text;
        const arrivalTime = leg.arrival_time?.text;
        
        const stops: Array<{name: string, lat: number, lng: number, order: number, type?: string, details?: string}> = [];
        let order = 0;
        let busLine = "";

        leg.steps.forEach((step: any) => {
          if (step.travel_mode === "TRANSIT" && step.transit_details) {
            const details = step.transit_details;
            const lineName = details.line?.short_name || details.line?.name || "Bus";
            if (!busLine) busLine = lineName;
            
            stops.push({
              name: details.departure_stop.name,
              lat: details.departure_stop.location.lat,
              lng: details.departure_stop.location.lng,
              order: order++,
              type: 'departure'
            });

            if (details.num_stops && details.num_stops > 1) {
               stops.push({
                   name: `${details.num_stops - 1} intermediate stops`,
                   details: `Via ${lineName}`,
                   lat: (details.departure_stop.location.lat + details.arrival_stop.location.lat) / 2,
                   lng: (details.departure_stop.location.lng + details.arrival_stop.location.lng) / 2,
                   order: order++,
                   type: 'intermediate'
               });
            }

            stops.push({
              name: details.arrival_stop.name,
              lat: details.arrival_stop.location.lat,
              lng: details.arrival_stop.location.lng,
              order: order++,
              type: 'arrival'
            });
          }
        });

        if (stops.length === 0) {
            stops.push({ name: origin, lat: leg.start_location.lat, lng: leg.start_location.lng, order: order++ });
            stops.push({ name: destination, lat: leg.end_location.lat, lng: leg.end_location.lng, order: order++ });
        }

        return {
          id: `route-${index}`,
          distance,
          duration,
          busLine,
          departureTime,
          arrivalTime,
          stops
        };
      });

      if (parsedRoutes.length === 0) {
         throw new Error("No transit routes found");
      }

      const primaryRoute = parsedRoutes[0];

      return {
        ...primaryRoute,
        routes: parsedRoutes
      };
    } catch (error: any) {
      console.error("Error fetching transit directions:", error);
      throw error;
    }
  }
};

/**
 * Mock data generator for testing when API key is missing or route not found
 */
function mockTransitData(origin: string, destination: string): Promise<TransitResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const o = origin.toLowerCase();
      const d = destination.toLowerCase();

      // Matara <-> Colombo
      if ((o.includes("matara") && d.includes("colombo")) || (o.includes("colombo") && d.includes("matara"))) {
        const route1: TransitRouteResult = {
          id: "r1", distance: 157, duration: 176, busLine: "EX1-18", departureTime: "12:00 PM", arrivalTime: "2:56 PM",
          stops: [
            { name: "Matara Bus Stand", lat: 5.9496, lng: 80.5469, order: 0, type: 'departure' },
            { name: "Godagama Interchange", details: "Enter Southern Expressway", lat: 5.9865, lng: 80.5284, order: 1, type: 'intermediate' },
            { name: "Galle Interchange", details: "Expressway Waypoint", lat: 6.0734, lng: 80.2450, order: 2, type: 'intermediate' },
            { name: "Dodangoda Interchange", details: "Expressway Waypoint", lat: 6.5894, lng: 80.0345, order: 3, type: 'intermediate' },
            { name: "Makumbura Multimodal Center", lat: 6.8415, lng: 79.9575, order: 4, type: 'arrival' },
            { name: "Colombo Fort Bus Station", lat: 6.9333, lng: 79.8497, order: 5, type: 'arrival' }
          ]
        };
        const route2: TransitRouteResult = {
          id: "r2", distance: 158, duration: 185, busLine: "EX1/3/1932", departureTime: "12:15 PM", arrivalTime: "3:20 PM",
          stops: [
            { name: "Matara Bus Stand", lat: 5.9496, lng: 80.5469, order: 0, type: 'departure' },
            { name: "Welipenna Service Area", details: "Expressway Waypoint", lat: 6.4383, lng: 80.1240, order: 1, type: 'intermediate' },
            { name: "Kottawa Interchange", lat: 6.8415, lng: 79.9575, order: 2, type: 'arrival' },
            { name: "Colombo Fort", lat: 6.9333, lng: 79.8497, order: 3, type: 'arrival' }
          ]
        };
        resolve({
          ...route1,
          routes: [route1, route2]
        });
      } 
      // Galle <-> Ambalangoda
      else if ((o.includes("galle") && d.includes("ambalangoda")) || (o.includes("ambalangoda") && d.includes("galle"))) {
        const r: TransitRouteResult = {
          id: "r3", distance: 33.4, duration: 46, busLine: "388/1", departureTime: "10:00 AM", arrivalTime: "10:46 AM",
          stops: [
            { name: "Galle Central Bus Stand", lat: 6.0333, lng: 80.2167, order: 0, type: 'departure' },
            { name: "Hikkaduwa Bus Stop", lat: 6.1395, lng: 80.1064, order: 1, type: 'intermediate' },
            { name: "Ambalangoda Station", lat: 6.2267, lng: 80.0553, order: 2, type: 'arrival' }
          ]
        };
        resolve({ ...r, routes: [r] });
      }
      // Dickwella <-> Matara
      else if ((o.includes("dickwella") && d.includes("matara")) || (o.includes("matara") && d.includes("dickwella"))) {
        const r: TransitRouteResult = {
          id: "r5", distance: 22.8, duration: 45, busLine: "32-1", departureTime: "9:30 AM", arrivalTime: "10:15 AM",
          stops: [
            { name: "Dickwella Town", lat: 5.9667, lng: 80.6833, order: 0, type: 'departure' },
            { name: "Gandara", lat: 5.9500, lng: 80.6000, order: 1, type: 'intermediate' },
            { name: "Matara Bus Stand", lat: 5.9496, lng: 80.5469, order: 2, type: 'arrival' }
          ]
        };
        resolve({ ...r, routes: [r] });
      }
      // Generic Fallback
      else {
        const r: TransitRouteResult = {
          id: "r4", distance: 12.5, duration: 25, busLine: "Local Bus", departureTime: "1:00 PM", arrivalTime: "1:25 PM",
          stops: [
            { name: origin || "Start Point", lat: 6.9271, lng: 79.8612, order: 0, type: 'departure' },
            { name: "Intermediate Waypoint", lat: 6.9171, lng: 79.8712, order: 1, type: 'intermediate' },
            { name: destination || "End Point", lat: 6.9071, lng: 79.8812, order: 2, type: 'arrival' }
          ]
        };
        resolve({ ...r, routes: [r] });
      }
    }, 1500);
  });
}
