import fetch from 'node-fetch';
import { ConflictEvent, AgentRun } from '../types';
import { getEventsNeedingGeocoding, updateEvent, logAgentRun } from '../utils';

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

async function geocodeLocation(location: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WorldViewFM-ConflictIntel/1.0 (conflict monitoring research)'
      },
      timeout: 10000
    });

    if (!response.ok) {
      console.log(`[Geocoder] Nominatim request failed: ${response.status}`);
      return null;
    }

    const results = await response.json() as NominatimResult[];

    if (results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error(`[Geocoder] Error geocoding "${location}":`, error);
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runGeocoder(): Promise<AgentRun> {
  const agentId = 'geocoder';
  const runAt = new Date().toISOString();
  const errors: string[] = [];
  let geocodedCount = 0;

  console.log('[Geocoder] Starting run...');

  try {
    const eventsNeedingGeo = getEventsNeedingGeocoding();

    if (eventsNeedingGeo.length === 0) {
      console.log('[Geocoder] No events need geocoding');
      return {
        agentId,
        runAt,
        eventsFound: 0,
        errors
      };
    }

    console.log(`[Geocoder] Geocoding ${eventsNeedingGeo.length} events...`);

    let skippedCount = 0;
    for (const event of eventsNeedingGeo) {
      // Skip events with no usable location
      if (!event.location || event.location === 'Unknown' || event.location === 'Global' || event.location.length < 3) {
        skippedCount++;
        continue;
      }

      console.log(`[Geocoder] Attempting: "${event.location}"`);

      try {
        const coords = await geocodeLocation(event.location);

        if (coords) {
          const updated = updateEvent(event.id, {
            lat: coords.lat,
            lon: coords.lon
          });

          if (updated) {
            geocodedCount++;
            console.log(`[Geocoder] SUCCESS: "${event.location}" -> ${coords.lat}, ${coords.lon}`);
          }
        } else {
          console.log(`[Geocoder] NO RESULT: "${event.location}"`);
        }
      } catch (err) {
        console.log(`[Geocoder] ERROR for "${event.location}": ${err}`);
      }

      // Rate limit: 1 request per second (Nominatim policy)
      await sleep(1100);
    }

    if (skippedCount > 0) {
      console.log(`[Geocoder] Skipped ${skippedCount} events with unusable locations`);
    }

    console.log(`[Geocoder] Geocoded ${geocodedCount} events`);
  } catch (error) {
    const errMsg = `Geocoding error: ${error}`;
    console.error(`[Geocoder] ${errMsg}`);
    errors.push(errMsg);
  }

  const run: AgentRun = {
    agentId,
    runAt,
    eventsFound: geocodedCount,
    errors
  };

  logAgentRun(run);
  return run;
}
