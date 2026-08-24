import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Property } from '../types';
import { Link } from 'react-router-dom';

// Fix default Leaflet marker icon URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PropertyMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  radiusKm?: number;
  height?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  center = [12.9348, 80.2321], // Default Chennai OMR
  zoom = 12,
  radiusKm,
  height = '450px',
}) => {
  const mapCenter: [number, number] = properties.length > 0 && properties[0].latitude
    ? [properties[0].latitude, properties[0].longitude]
    : center;

  return (
    <div className="rounded-3 overflow-hidden border border-secondary shadow" style={{ height }}>
      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {radiusKm && (
          <Circle
            center={mapCenter}
            radius={radiusKm * 1000}
            pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.15 }}
          />
        )}

        {properties.map((p) => {
          if (!p.latitude || !p.longitude) return null;
          return (
            <Marker key={p._id} position={[p.latitude, p.longitude]}>
              <Popup>
                <div style={{ maxWidth: 200 }}>
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'}
                    alt={p.title}
                    style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <h6 className="fw-bold my-1 text-truncate">{p.title}</h6>
                  <p className="small text-muted mb-1">₹{(p.price / 100000).toFixed(1)} Lakhs | {p.bedrooms} BHK</p>
                  <Link to={`/properties/${p._id}`} className="btn btn-sm btn-primary w-100 py-0">
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
