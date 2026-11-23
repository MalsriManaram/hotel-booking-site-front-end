import { ExternalLink, MapPin } from "lucide-react";

const KNOWN_COORDINATES = [
  { match: /paris|montmartre/i, lat: 48.8606, lon: 2.3376 },
  { match: /sydney|harbour|bondi/i, lat: -33.8568, lon: 151.2153 },
  { match: /tokyo|shibuya/i, lat: 35.6586, lon: 139.7454 },
  { match: /kyoto|gion/i, lat: 35.0116, lon: 135.7681 },
  { match: /rome|vatican|colosseum/i, lat: 41.8902, lon: 12.4922 },
  { match: /milan|duomo/i, lat: 45.4642, lon: 9.19 },
  { match: /colombo|sri lanka/i, lat: 6.9271, lon: 79.8612 },
  { match: /kandy/i, lat: 7.2906, lon: 80.6337 },
  { match: /galle/i, lat: 6.0535, lon: 80.221 },
  { match: /london/i, lat: 51.5072, lon: -0.1276 },
  { match: /dubai/i, lat: 25.2048, lon: 55.2708 },
  { match: /singapore/i, lat: 1.2834, lon: 103.8607 },
  { match: /bali/i, lat: -8.4095, lon: 115.1889 },
  { match: /maldives/i, lat: 4.1755, lon: 73.5093 },
];

function resolveCoordinates(queryText = "") {
  for (const item of KNOWN_COORDINATES) {
    if (item.match.test(queryText)) {
      return { lat: item.lat, lon: item.lon };
    }
  }
  // Default to Colombo global concierge headquarters
  return { lat: 6.9271, lon: 79.8612 };
}

const InteractiveMap = ({ location = "", title = "Location Map", className = "h-72" }) => {
  const { lat, lon } = resolveCoordinates(`${title} ${location}`);
  const deltaLat = 0.025;
  const deltaLon = 0.038;
  const bbox = `${(lon - deltaLon).toFixed(5)}%2C${(lat - deltaLat).toFixed(
    5
  )}%2C${(lon + deltaLon).toFixed(5)}%2C${(lat + deltaLat).toFixed(5)}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(
    5
  )}%2C${lon.toFixed(5)}`;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${title} ${location}`.trim()
  )}`;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm ${className}`}
    >
      <iframe
        title={title}
        src={osmUrl}
        className="w-full h-full border-0"
        loading="lazy"
      />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        <span className="pointer-events-auto inline-flex items-center gap-1.5 bg-neutral-950/85 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow">
          <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="truncate max-w-[200px]">{location || title}</span>
        </span>
        <a
          href={externalMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-1 bg-white/95 hover:bg-white text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow border border-neutral-200 transition-colors"
        >
          <span>Open Map</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default InteractiveMap;
