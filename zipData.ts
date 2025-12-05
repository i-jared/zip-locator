import zipCsvData from './zip_lat_long.csv?raw';

export interface ZipCoord {
  lat: number;
  lng: number;
}

export const getZipMap = (): Map<string, ZipCoord> => {
  const map = new Map<string, ZipCoord>();
  
  // Split by new line
  const lines = zipCsvData.trim().split('\n');
  
  // Skip header if exists (simple check)
  const startIndex = lines[0].startsWith('ZIP') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Format: ZIP,LAT,LNG
    // Note: there might be a space after commas based on some inputs, handle that.
    const parts = line.split(',');
    if (parts.length < 3) continue;

    const zip = parts[0].trim();
    const lat = parseFloat(parts[1].trim());
    const lng = parseFloat(parts[2].trim());

    if (!isNaN(lat) && !isNaN(lng)) {
      map.set(zip, { lat, lng });
    }
  }

  return map;
};