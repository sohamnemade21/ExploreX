/**
 * WeatherService: Direct integration with Open-Meteo API
 * Zero-cost, high-reliability weather forecasting with in-memory caching and geocoding
 */
import { db } from '../db';

export interface HourlyWeatherForecast {
  time: string; // e.g. "14:00"
  hour: number; // 0-23
  tempC: number;
  precipitationProbability: number;
  precipitationMm: number;
  weatherCode: number;
  condition: string;
  isRainy: boolean;
  isNight: boolean;
}

export interface DailyWeatherForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  weatherCode: number;
  condition: string;
  isRainy: boolean;
  advisory?: string;
}

export interface WeatherTravelAlert {
  id: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  category: 'rain' | 'heat' | 'thunderstorm' | 'wind' | 'pleasant';
  title: string;
  message: string;
  impactWindow?: string;
  recommendedAction: string;
}

export interface LiveWeatherReport {
  destinationName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    tempC: number;
    feelsLikeC: number;
    humidity: number;
    windSpeedKmH: number;
    precipitationMm: number;
    weatherCode: number;
    condition: string;
    isRainy: boolean;
  };
  hourly: HourlyWeatherForecast[];
  daily: DailyWeatherForecast[];
  alerts: WeatherTravelAlert[];
  travelRecommendation: string;
  summaryText: string;
  safetyAdvisory?: string;
  source: 'open-meteo' | 'cache' | 'fallback';
}

interface CacheEntry {
  data: LiveWeatherReport;
  timestamp: number;
}

// In-memory cache with 30-minute TTL
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export class WeatherService {
  /**
   * Translates WMO weather code to human-readable travel condition
   */
  public static translateWeatherCode(code: number): { condition: string; isRainy: boolean; icon: string } {
    switch (code) {
      case 0:
        return { condition: 'Clear Sky', isRainy: false, icon: 'sun' };
      case 1:
        return { condition: 'Mainly Clear', isRainy: false, icon: 'sun' };
      case 2:
        return { condition: 'Partly Cloudy', isRainy: false, icon: 'cloud-sun' };
      case 3:
        return { condition: 'Overcast', isRainy: false, icon: 'cloud' };
      case 45:
      case 48:
        return { condition: 'Misty & Foggy', isRainy: false, icon: 'cloud-fog' };
      case 51:
      case 53:
      case 55:
        return { condition: 'Light Drizzle', isRainy: true, icon: 'cloud-drizzle' };
      case 61:
      case 63:
      case 65:
        return { condition: 'Rain Showers', isRainy: true, icon: 'cloud-rain' };
      case 71:
      case 73:
      case 75:
        return { condition: 'Snowfall', isRainy: true, icon: 'snowflake' };
      case 80:
      case 81:
      case 82:
        return { condition: 'Heavy Rain Showers', isRainy: true, icon: 'cloud-rain' };
      case 95:
      case 96:
      case 99:
        return { condition: 'Thunderstorm', isRainy: true, icon: 'cloud-lightning' };
      default:
        return { condition: 'Pleasant & Mild', isRainy: false, icon: 'sun' };
    }
  }

  /**
   * Resolve location name into coordinates using DB or Open-Meteo Geocoding
   */
  public async geocodeLocation(query: string): Promise<{ name: string; lat: number; lng: number; state?: string }> {
    const clean = query.trim().toLowerCase();
    const dests = db.getDestinations();

    // 1. Check local catalog
    const local = dests.find(d => 
      d.name.toLowerCase().includes(clean) || 
      clean.includes(d.name.toLowerCase()) ||
      (d.state && d.state.toLowerCase().includes(clean))
    );

    if (local && local.lat && local.lng) {
      return { name: local.name, lat: local.lat, lng: local.lng, state: local.state };
    }

    // 2. Known Indian major locations quick table
    const knownLocations: Record<string, { name: string; lat: number; lng: number; state: string }> = {
      pune: { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
      mumbai: { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
      goa: { name: 'Goa', lat: 15.2993, lng: 74.1240, state: 'Goa' },
      manali: { name: 'Manali', lat: 32.2396, lng: 77.1887, state: 'Himachal Pradesh' },
      jaipur: { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
      delhi: { name: 'New Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
      bengaluru: { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
      bangalore: { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
      hyderabad: { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
      varanasi: { name: 'Varanasi', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
      kochi: { name: 'Kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
      kerala: { name: 'Kerala (Kochi)', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
      rishikesh: { name: 'Rishikesh', lat: 30.0869, lng: 78.2676, state: 'Uttarakhand' },
      mahabaleshwar: { name: 'Mahabaleshwar', lat: 17.9237, lng: 73.6586, state: 'Maharashtra' },
      lonavala: { name: 'Lonavala', lat: 18.7557, lng: 73.4091, state: 'Maharashtra' },
      udaipur: { name: 'Udaipur', lat: 24.5854, lng: 73.7125, state: 'Rajasthan' },
      agra: { name: 'Agra', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
      shimla: { name: 'Shimla', lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
      darjeeling: { name: 'Darjeeling', lat: 27.0410, lng: 88.2663, state: 'West Bengal' },
      gangtok: { name: 'Gangtok', lat: 27.3389, lng: 88.6065, state: 'Sikkim' },
      munnar: { name: 'Munnar', lat: 10.0889, lng: 77.0595, state: 'Kerala' },
      hampi: { name: 'Hampi', lat: 15.3350, lng: 76.4600, state: 'Karnataka' },
      sindhudurg: { name: 'Sindhudurg', lat: 16.0200, lng: 73.5300, state: 'Maharashtra' },
      tarkarli: { name: 'Tarkarli', lat: 16.0300, lng: 73.4700, state: 'Maharashtra' },
      solapur: { name: 'Solapur', lat: 17.6599, lng: 75.9064, state: 'Maharashtra' },
      kolhapur: { name: 'Kolhapur', lat: 16.7050, lng: 74.2433, state: 'Maharashtra' },
      satara: { name: 'Satara', lat: 17.6805, lng: 73.9928, state: 'Maharashtra' },
      chettinad: { name: 'Chettinad', lat: 10.0700, lng: 78.7800, state: 'Tamil Nadu' },
      tirthan: { name: 'Tirthan Valley', lat: 31.6400, lng: 77.4400, state: 'Himachal Pradesh' },
      raghurajpur: { name: 'Raghurajpur', lat: 19.8600, lng: 85.8200, state: 'Odisha' }
    };

    for (const [key, loc] of Object.entries(knownLocations)) {
      if (clean.includes(key) || key.includes(clean)) {
        return loc;
      }
    }

    // 3. Fallback to Open-Meteo free geocoding API
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
      const res = await fetch(geoUrl, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const geoData = await res.json();
        if (geoData.results && geoData.results.length > 0) {
          const first = geoData.results[0];
          return {
            name: first.name,
            lat: first.latitude,
            lng: first.longitude,
            state: first.admin1 || first.country
          };
        }
      }
    } catch (e) {
      console.warn('Open-Meteo geocoding fallback warning:', (e as Error).message);
    }

    return { name: query, lat: 18.5204, lng: 73.8567, state: 'India' };
  }

  /**
   * Search multiple location candidates
   */
  public async searchLocations(query: string): Promise<Array<{ name: string; state?: string; lat: number; lng: number }>> {
    const clean = query.trim().toLowerCase();
    const dests = db.getDestinations();
    const matches: Array<{ name: string; state?: string; lat: number; lng: number }> = [];

    // Local DB matches
    dests.forEach(d => {
      if (d.name.toLowerCase().includes(clean) || (d.state && d.state.toLowerCase().includes(clean))) {
        matches.push({ name: d.name, state: d.state, lat: d.lat || 18.52, lng: d.lng || 73.85 });
      }
    });

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
      const res = await fetch(geoUrl, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const geoData = await res.json();
        if (geoData.results) {
          geoData.results.forEach((r: any) => {
            if (!matches.some(m => m.name.toLowerCase() === r.name.toLowerCase())) {
              matches.push({
                name: r.name,
                state: r.admin1 || r.country,
                lat: r.latitude,
                lng: r.longitude
              });
            }
          });
        }
      }
    } catch {}

    return matches.slice(0, 8);
  }

  /**
   * Fetches real-time weather, 24-hour hourly, and 7-day forecast from Open-Meteo for any geo coordinates.
   */
  public async getWeather(
    lat: number,
    lng: number,
    destinationName?: string
  ): Promise<LiveWeatherReport> {
    const targetName = destinationName || 'Destination';

    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return this.getFallbackWeather(lat || 18.52, lng || 73.85, targetName);
    }

    const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    const now = Date.now();
    const cached = weatherCache.get(cacheKey);

    if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
      return { ...cached.data, destinationName: targetName, source: 'cache' };
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(4500)
      });

      if (!response.ok) {
        console.warn(`Open-Meteo API returned status ${response.status} for ${lat},${lng}`);
        return this.getFallbackWeather(lat, lng, targetName);
      }

      const json = await response.json();
      const currentData = json.current || {};
      const hourlyData = json.hourly || {};
      const dailyData = json.daily || {};

      const currentCode = Number(currentData.weather_code ?? 0);
      const currentParsed = WeatherService.translateWeatherCode(currentCode);

      // 1. Process 24-Hour Hourly Forecast
      const hourlyForecasts: HourlyWeatherForecast[] = [];
      const hTimes: string[] = hourlyData.time || [];
      const hTemps: number[] = hourlyData.temperature_2m || [];
      const hRainProbs: number[] = hourlyData.precipitation_probability || [];
      const hPrecipMm: number[] = hourlyData.precipitation || [];
      const hCodes: number[] = hourlyData.weather_code || [];
      const hIsDay: number[] = hourlyData.is_day || [];

      const currentHourIndex = new Date().getHours();
      const sliceStart = Math.min(Math.max(0, currentHourIndex), Math.max(0, hTimes.length - 24));
      const sliceEnd = Math.min(hTimes.length, sliceStart + 24);

      for (let i = sliceStart; i < sliceEnd; i++) {
        const rawTime = hTimes[i] || '';
        const timePart = rawTime.includes('T') ? rawTime.split('T')[1].substring(0, 5) : `${i % 24}:00`;
        const code = Number(hCodes[i] ?? 0);
        const parsed = WeatherService.translateWeatherCode(code);
        const hVal = parseInt(timePart.split(':')[0], 10) || 0;

        hourlyForecasts.push({
          time: timePart,
          hour: hVal,
          tempC: Math.round(hTemps[i] ?? 26),
          precipitationProbability: Math.round(hRainProbs[i] ?? 0),
          precipitationMm: Number(hPrecipMm[i] ?? 0),
          weatherCode: code,
          condition: parsed.condition,
          isRainy: parsed.isRainy || (hRainProbs[i] || 0) > 50,
          isNight: hIsDay[i] === 0
        });
      }

      // 2. Process Daily Forecast
      const dailyForecasts: DailyWeatherForecast[] = [];
      const dates: string[] = dailyData.time || [];
      const maxTemps: number[] = dailyData.temperature_2m_max || [];
      const minTemps: number[] = dailyData.temperature_2m_min || [];
      const rainProbs: number[] = dailyData.precipitation_probability_max || [];
      const codes: number[] = dailyData.weather_code || [];

      for (let i = 0; i < dates.length; i++) {
        const dCode = Number(codes[i] ?? 0);
        const parsed = WeatherService.translateWeatherCode(dCode);
        const prob = Math.round(rainProbs[i] ?? 0);
        const dateObj = new Date(dates[i]);
        const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

        let advisory: string | undefined;
        if (prob >= 60 || parsed.isRainy) {
          advisory = 'High rain probability; carry rain gear & schedule indoor attractions during shower windows.';
        } else if (maxTemps[i] > 36) {
          advisory = 'Midday heat peak; explore monuments before 11 AM or post 4 PM.';
        }

        dailyForecasts.push({
          date: dates[i],
          dayName,
          tempMax: Math.round(maxTemps[i] ?? 28),
          tempMin: Math.round(minTemps[i] ?? 20),
          precipitationProbability: prob,
          weatherCode: dCode,
          condition: parsed.condition,
          isRainy: parsed.isRainy,
          advisory
        });
      }

      const tempC = Math.round(currentData.temperature_2m ?? 27);
      const feelsLikeC = Math.round(currentData.apparent_temperature ?? tempC);
      const humidity = Math.round(currentData.relative_humidity_2m ?? 65);
      const windSpeedKmH = Math.round(currentData.wind_speed_10m ?? 12);
      const precipitationMm = Number(currentData.precipitation ?? 0);

      // 3. Generate Travel Alerts
      const alerts: WeatherTravelAlert[] = [];
      
      // Check for afternoon rain window
      const rainyHours = hourlyForecasts.filter(h => h.isRainy || h.precipitationMm > 1.5 || h.precipitationProbability > 65);
      if (rainyHours.length > 0) {
        const firstRain = rainyHours[0].time;
        const lastRain = rainyHours[rainyHours.length - 1].time;
        alerts.push({
          id: 'alert-rain',
          severity: rainyHours.some(h => h.precipitationMm > 4 || h.precipitationProbability > 80) ? 'high' : 'moderate',
          category: 'rain',
          title: '🌧️ Rainfall Expected During Sightseeing Hours',
          message: `Precipitation peak detected in ${targetName} between ${firstRain} and ${lastRain}. Rain probability reaches up to ${Math.max(...rainyHours.map(h => h.precipitationProbability))}%.`,
          impactWindow: `${firstRain} – ${lastRain}`,
          recommendedAction: 'Move outdoor monuments to clear morning slots and schedule covered museums or artisan workshops during rain.'
        });
      }

      if (tempC >= 37) {
        alerts.push({
          id: 'alert-heat',
          severity: tempC >= 40 ? 'severe' : 'high',
          category: 'heat',
          title: '☀️ High Heat Index & UV Exposure',
          message: `Current temperature is ${tempC}°C (feels like ${feelsLikeC}°C). Direct midday sun exposure can cause dehydration.`,
          impactWindow: '11:30 AM – 03:30 PM',
          recommendedAction: 'Stay hydrated, carry sun protection, and plan indoor cultural activities during peak noon.'
        });
      }

      if (currentParsed.condition.toLowerCase().includes('thunderstorm') || currentCode >= 95) {
        alerts.push({
          id: 'alert-storm',
          severity: 'severe',
          category: 'thunderstorm',
          title: '⚡ Thunderstorm Warning Active',
          message: `Lightning and heavy squalls reported in ${targetName}. Coastal/water sport activities suspended.`,
          impactWindow: 'Next 3-5 Hours',
          recommendedAction: 'Seek sheltered indoor venues and avoid open viewpoints, cliffs, and water bodies.'
        });
      }

      if (alerts.length === 0) {
        alerts.push({
          id: 'alert-pleasant',
          severity: 'low',
          category: 'pleasant',
          title: '✨ Ideal Sightseeing Weather',
          message: `Favorable conditions in ${targetName} with pleasant temperatures (${tempC}°C) and low rain risk.`,
          recommendedAction: 'Perfect for all-day outdoor heritage walks, photography, and nature exploration.'
        });
      }

      // 4. Recommendation text
      let travelRecommendation = `Conditions in ${targetName} are favorable for travel.`;
      if (alerts.some(a => a.category === 'rain')) {
        travelRecommendation = `Heavy rain is forecasted during the day. We strongly recommend scheduling indoor museums, craft centers, and culinary sessions, and keeping outdoor fort/beach visits in dry windows.`;
      } else if (alerts.some(a => a.category === 'heat')) {
        travelRecommendation = `Midday temperatures are elevated. Prioritize early morning visits to monuments and spend the afternoon at air-conditioned galleries or covered cultural centers.`;
      }

      const summaryText = `${tempC}°C ${currentParsed.condition} in ${targetName} (Feels like ${feelsLikeC}°C, Humidity ${humidity}%, Wind ${windSpeedKmH} km/h)`;

      const report: LiveWeatherReport = {
        destinationName: targetName,
        latitude: lat,
        longitude: lng,
        timezone: json.timezone || 'Asia/Kolkata',
        current: {
          tempC,
          feelsLikeC,
          humidity,
          windSpeedKmH,
          precipitationMm,
          weatherCode: currentCode,
          condition: currentParsed.condition,
          isRainy: currentParsed.isRainy
        },
        hourly: hourlyForecasts,
        daily: dailyForecasts,
        alerts,
        travelRecommendation,
        summaryText,
        safetyAdvisory: alerts.find(a => a.severity === 'high' || a.severity === 'severe')?.message,
        source: 'open-meteo'
      };

      weatherCache.set(cacheKey, { data: report, timestamp: now });
      return report;
    } catch (err: any) {
      console.warn(`Open-Meteo weather fetch notice (${err.message}). Using seasonal baseline.`);
      return this.getFallbackWeather(lat, lng, targetName);
    }
  }

  /**
   * Fallback weather for offline/error handling
   */
  private getFallbackWeather(lat: number, lng: number, destinationName: string): LiveWeatherReport {
    const isNorthern = lat > 28;
    const isCoastal = lat < 18;
    const tempC = isNorthern ? 20 : isCoastal ? 29 : 27;
    const condition = 'Partly Cloudy & Pleasant';

    const today = new Date();
    const daily: DailyWeatherForecast[] = [];
    const hourly: HourlyWeatherForecast[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      daily.push({
        date: d.toISOString().split('T')[0],
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: tempC + 3,
        tempMin: tempC - 4,
        precipitationProbability: 15,
        weatherCode: 2,
        condition,
        isRainy: false,
        advisory: 'Pleasant weather for travel.'
      });
    }

    const currentHour = new Date().getHours();
    for (let i = 0; i < 24; i++) {
      const h = (currentHour + i) % 24;
      hourly.push({
        time: `${String(h).padStart(2, '0')}:00`,
        hour: h,
        tempC: tempC + (h >= 12 && h <= 16 ? 3 : -2),
        precipitationProbability: 10,
        precipitationMm: 0,
        weatherCode: 2,
        condition,
        isRainy: false,
        isNight: h < 6 || h > 19
      });
    }

    const alerts: WeatherTravelAlert[] = [{
      id: 'alert-normal',
      severity: 'low',
      category: 'pleasant',
      title: '✨ Pleasant Weather Conditions',
      message: `Stable weather conditions in ${destinationName}. Ideal for sightseeing.`,
      recommendedAction: 'Enjoy outdoor attractions, heritage walks, and markets.'
    }];

    return {
      destinationName,
      latitude: lat,
      longitude: lng,
      timezone: 'Asia/Kolkata',
      current: {
        tempC,
        feelsLikeC: tempC + 1,
        humidity: 60,
        windSpeedKmH: 12,
        precipitationMm: 0,
        weatherCode: 2,
        condition,
        isRainy: false
      },
      hourly,
      daily,
      alerts,
      travelRecommendation: `Standard seasonal conditions in ${destinationName}. Suitable for scheduled sightseeing.`,
      summaryText: `${tempC}°C ${condition} in ${destinationName} • Ideal for sightseeing`,
      source: 'fallback'
    };
  }
}

export const weatherService = new WeatherService();
