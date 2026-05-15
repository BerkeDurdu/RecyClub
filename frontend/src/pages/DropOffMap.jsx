import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api/axios';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function DropOffMap() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    api.get('/drop-off-points').then((r) => setPoints(r.data)).catch(() => setPoints([]));
  }, []);

  const center = points.length ? [Number(points[0].latitude), Number(points[0].longitude)] : [41.015, 28.98];

  return (
    <div className="container">
      <div className="card">
        <h2>♻ Drop-off Points</h2>
        <p>OpenStreetMap + Leaflet.js — geri dönüşüm noktalarını harita üzerinde göster.</p>
        <div style={{ height: 480, borderRadius: 8, overflow: 'hidden' }}>
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((p) => (
              <Marker key={p.id} position={[Number(p.latitude), Number(p.longitude)]}>
                <Popup>
                  <strong>{p.name}</strong><br />
                  {p.address}<br />
                  Accepts: {(p.acceptedTypes || []).join(', ') || '—'}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
