import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getZipMap, ZipCoord } from './zipData';
import { calculateDistance, TARGET_LOCATIONS, LocationTarget } from './utils';

interface SearchResult {
  queryZip: string;
  closestLocation: LocationTarget;
  distance: number;
  id: string; // unique id for key
}

const App: React.FC = () => {
  const [inputZip, setInputZip] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isShake, setIsShake] = useState(false);

  // Load zip data once on mount
  const zipMap = useMemo(() => getZipMap(), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputZip(e.target.value);
    if (error) setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 400);
  };

  const handleSubmit = () => {
    const zip = inputZip.trim();
    
    if (!zip) {
       return;
    }

    // Validate zip exists in our data
    const coord = zipMap.get(zip);

    if (!coord) {
      setError('Zip code not found in database.');
      triggerShake();
      return;
    }

    // Find closest location
    let minDistance = Infinity;
    let closest: LocationTarget | null = null;

    TARGET_LOCATIONS.forEach(loc => {
      const dist = calculateDistance(coord.lat, coord.lng, loc.lat, loc.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = loc;
      }
    });

    if (closest) {
      const newResult: SearchResult = {
        queryZip: zip,
        closestLocation: closest,
        distance: minDistance,
        id: Date.now().toString() + Math.random().toString()
      };

      setResults(prev => {
        // Add new result to top, keep max 5
        const updated = [newResult, ...prev];
        if (updated.length > 5) {
          return updated.slice(0, 5);
        }
        return updated;
      });
      
      setInputZip('');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-50 text-neutral-900 p-4 font-sans">
      
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Zip Locator</h1>
        </div>

        <div className="w-full relative">
          <input
            type="text"
            value={inputZip}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="zip code"
            className={`w-full bg-white border-2 ${error ? 'border-red-600 focus:border-red-600' : 'border-neutral-300 focus:border-neutral-700'} rounded-xl px-6 py-4 text-center text-xl placeholder-neutral-400 text-neutral-900 outline-none transition-all duration-200 shadow-lg ${isShake ? 'animate-shake' : ''}`}
            autoFocus
          />
          {error && (
            <p className="absolute -bottom-6 left-0 right-0 text-center text-red-700 text-xs font-medium animate-pulse">
              {error}
            </p>
          )}
        </div>

        <div className="w-full space-y-3 perspective-1000">
          {results.map((res, index) => (
            <div 
              key={res.id}
              className={`
                bg-white border border-neutral-300 rounded-lg p-4 
                flex justify-between items-center shadow-md 
                transition-all duration-500 ease-out transform
                ${index === 0 ? 'translate-y-0 opacity-100 scale-100' : 'opacity-90 scale-95'}
              `}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Zip Code</span>
                <span className="text-lg font-mono text-neutral-900">{res.queryZip}</span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Nearest</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-neutral-900">{res.closestLocation.name}</span>
                  <span className="text-xs text-neutral-600 font-mono">({res.distance.toFixed(1)} mi)</span>
                </div>
              </div>
            </div>
          ))}
          
          {results.length === 0 && (
            <div className="text-center py-8 text-neutral-500 italic text-sm">
              Results will appear here...
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;