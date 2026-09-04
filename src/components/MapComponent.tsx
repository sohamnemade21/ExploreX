import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category?: string;
  rating?: number;
  image?: string;
  price?: number;
  description?: string;
}

export interface MapRoutePoint {
  lat: number;
  lng: number;
  title?: string;
}

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  route?: MapRoutePoint[];
  pickupCoords?: { lat: number; lng: number };
  dropCoords?: { lat: number; lng: number };
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  interactive?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom = 12,
  markers = [],
  route = [],
  pickupCoords,
  dropCoords,
  className = 'h-96 w-full rounded-2xl overflow-hidden',
  onMarkerClick,
  interactive = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: interactive,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright' })
        .addAttribution('&copy; <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a>')
        .addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    return () => {
      // Don't destroy on every rerender, just cleanup layers
    };
  }, [center[0], center[1], zoom, interactive]);

  // Update markers and routes whenever props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Custom Icon generator helper
    const createCustomIcon = (bgColor: string, iconHtml: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background: ${bgColor};
            color: white;
            border-radius: 9999px;
            padding: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            width: 32px;
            height: 32px;
          ">
            ${iconHtml}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });
    };

    // Render Markers
    markers.forEach(m => {
      let iconColor = '#0284c7'; // Sky
      let symbol = '📍';
      if (m.category === 'Sightseeing' || m.category === 'Heritage') {
        iconColor = '#d97706'; // Amber
        symbol = '🏛️';
      } else if (m.category === 'Nature' || m.category === 'Adventure') {
        iconColor = '#059669'; // Emerald
        symbol = '🌲';
      } else if (m.category === 'Food') {
        iconColor = '#e11d48'; // Rose
        symbol = '🍽️';
      }

      const icon = createCustomIcon(iconColor, `<span style="font-size: 14px;">${symbol}</span>`);
      const marker = L.marker([m.lat, m.lng], { icon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 min-w-[200px] text-slate-800 font-sans';
      popupContent.innerHTML = `
        ${m.image ? `<img src="${m.image}" alt="${m.title}" class="w-full h-24 object-cover rounded-lg mb-2 shadow-sm" />` : ''}
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">${m.category || 'Spot'}</span>
          ${m.rating ? `<span class="text-xs font-bold text-amber-600">★ ${m.rating}</span>` : ''}
        </div>
        <h4 class="font-bold text-sm text-slate-900 leading-snug">${m.title}</h4>
        ${m.description ? `<p class="text-xs text-slate-500 mt-1 line-clamp-2">${m.description}</p>` : ''}
        ${m.price !== undefined ? `<div class="mt-2 text-xs font-bold text-sky-700">Entry / Price: $${m.price}</div>` : ''}
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(m);
      });

      marker.addTo(layerGroup);
    });

    // Render Pickup & Drop markers for Explorer
    if (pickupCoords) {
      const pickupIcon = createCustomIcon('#2563eb', '<span style="font-size:13px; font-weight:bold;">A</span>');
      L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
        .bindPopup('<b>Pickup Location</b>')
        .addTo(layerGroup);
    }

    if (dropCoords) {
      const dropIcon = createCustomIcon('#dc2626', '<span style="font-size:13px; font-weight:bold;">B</span>');
      L.marker([dropCoords.lat, dropCoords.lng], { icon: dropIcon })
        .bindPopup('<b>Drop Destination</b>')
        .addTo(layerGroup);

      if (pickupCoords) {
        // Draw route polyline between pickup and drop
        const polyline = L.polyline(
          [
            [pickupCoords.lat, pickupCoords.lng],
            [
              (pickupCoords.lat + dropCoords.lat) / 2 + 0.005,
              (pickupCoords.lng + dropCoords.lng) / 2 - 0.003
            ],
            [dropCoords.lat, dropCoords.lng]
          ],
          { color: '#2563eb', weight: 4, opacity: 0.8, dashArray: '6, 8' }
        ).addTo(layerGroup);

        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      }
    }

    // Render Itinerary Route
    if (route.length > 1) {
      const latlngs: [number, number][] = route.map(r => [r.lat, r.lng]);
      const polyline = L.polyline(latlngs, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.85
      }).addTo(layerGroup);

      // Route sequence stops
      route.forEach((stop, idx) => {
        const stopIcon = createCustomIcon('#0f172a', `<span style="font-size:11px; font-weight:bold;">${idx + 1}</span>`);
        L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .bindPopup(`<b>Stop ${idx + 1}: ${stop.title || 'Itinerary Landmark'}</b>`)
          .addTo(layerGroup);
      });

      map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
    }
  }, [markers, route, pickupCoords, dropCoords, onMarkerClick]);

  return (
    <div className={`relative ${className} z-0`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
