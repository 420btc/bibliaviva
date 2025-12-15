"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icons in Next.js/Leaflet
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Location {
    name: string
    description: string
    coordinates: { lat: number; lng: number }
    type: string
}

interface MapDisplayProps {
    locations: Location[]
}

export default function MapDisplay({ locations }: MapDisplayProps) {
    // Calcular centro del mapa basado en locations
    const defaultCenter = { lat: 31.7683, lng: 35.2137 } // Jerusalem
    const center = locations.length > 0 ? locations[0].coordinates : defaultCenter

    return (
        <MapContainer 
            center={[center.lat, center.lng]} 
            zoom={8} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc, idx) => (
                <Marker 
                    key={idx} 
                    position={[loc.coordinates.lat, loc.coordinates.lng]}
                    icon={customIcon}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-sm">{loc.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{loc.description}</p>
                            <span className="text-[10px] uppercase tracking-wider text-primary mt-2 block">{loc.type}</span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
