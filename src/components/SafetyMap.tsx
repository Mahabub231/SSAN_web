import { useEffect, useRef } from 'react';

interface Incident {
  id: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface SafetyMapProps {
  incidents: Incident[];
  userLocation?: [number, number];
}

export function SafetyMap({ incidents, userLocation = [23.8103, 90.4125] }: SafetyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Clear any existing map
      mapRef.current!.innerHTML = '';
      
      // Create map container
      const mapContainer = document.createElement('div');
      mapContainer.style.height = '100%';
      mapContainer.style.width = '100%';
      mapRef.current!.appendChild(mapContainer);

      // Initialize map - centered on Dhaka, Bangladesh
      const map = L.map(mapContainer).setView(userLocation, 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Fix default marker icon
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Add user location marker
      L.marker(userLocation, { icon: DefaultIcon })
        .addTo(map)
        .bindPopup('<strong>Your Location</strong>');

      // Add incident markers and circles
      incidents.forEach((incident) => {
        const color = incident.severity === 'high' ? '#ef4444' 
          : incident.severity === 'medium' ? '#f59e0b' 
          : '#10b981';

        // Add circle
        L.circle([incident.lat, incident.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
          radius: 200
        }).addTo(map);

        // Add marker with popup
        const severityBadge = incident.severity === 'high' 
          ? '<span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">HIGH</span>'
          : incident.severity === 'medium'
          ? '<span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">MEDIUM</span>'
          : '<span style="background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">LOW</span>';

        L.marker([incident.lat, incident.lng], { icon: DefaultIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 150px;">
              <strong style="font-size: 14px;">${incident.type}</strong>
              <p style="margin: 8px 0; font-size: 12px; color: #666;">${incident.description}</p>
              ${severityBadge}
            </div>
          `);
      });

      // Cleanup function
      return () => {
        map.remove();
      };
    });
  }, [incidents, userLocation]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="h-full w-full"></div>
    </div>
  );
}