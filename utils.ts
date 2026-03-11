/**
 * Converts degrees to radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calculates the distance between two coordinates using the Haversine formula.
 * Returns distance in miles.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 0.621371; // Convert to miles
};

export interface LocationTarget {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const TARGET_LOCATIONS: LocationTarget[] = [
  { id: 'puyallup', name: 'Puyallup', lat: 47.15476965557829, lng: -122.32106655842479 },
  { id: 'renton', name: 'Renton', lat: 47.470826179776566, lng: -122.23386552805387 },
  { id: 'everett', name: 'Everett', lat: 47.907556185455604, lng: -122.23426400229107 },
  { id: 'vancouver', name: 'Vancouver', lat: 45.65842399116114, lng: -122.59338621772888 },
  { id: 'kirkland', name: 'Kirkland', lat: 47.70997319790552, lng: -122.19003647346379 },
  { id: 'meridian-gentry-way', name: '3080 E Gentry Way #200, Meridian', lat: 43.5983436, lng: -116.3567336 },
  { id: 'park-city-center-drive', name: '1122 Center Dr Ste D-350, Park City', lat: 40.7201349, lng: -111.5390464 },
  { id: 'slc-3000-east', name: '6360 S 3000 E Ste 2000, SLC', lat: 40.6339463, lng: -111.8067671 },
];
