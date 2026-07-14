import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

function DashboardWilayahPelangganContent({ wilayah = [] }) {
  const getColor = (total) => {
    if (total >= 30) return "#dc2626";
    if (total >= 20) return "#f97316";
    if (total >= 10) return "#facc15";

    return "#22c55e";
  };

  const getRadius = (total) => {
    if (total >= 30) return 18;
    if (total >= 20) return 15;
    if (total >= 10) return 12;

    return 10;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-bold text-xl text-gray-800">
          Sebaran Wilayah Pelanggan
        </h3>

        <p className="text-gray-500">Area Kabupaten Semarang dan Sekitarnya</p>
      </div>

      {/* MAP */}
      <div className="flex-1 rounded-xl overflow-hidden border">
        <MapContainer
          center={[-7.235, 110.43]}
          zoom={10}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {wilayah.map((item) => (
            <CircleMarker
              key={item.wilayah}
              center={[item.latitude, item.longitude]}
              radius={getRadius(item.total)}
              pathOptions={{
                fillColor: getColor(item.total),
                color: "#fff",
                weight: 2,
                fillOpacity: 0.9,
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                permanent={false}
              >
                <div className="text-center">
                  <div className="font-bold text-base">{item.wilayah}</div>

                  <div className="text-orange-500 font-semibold">
                    {item.total} transaksi
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}

      <div className="flex justify-center gap-5 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          1-9
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          10-19
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          20-29
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          ≥30
        </div>
      </div>
    </div>
  );
}

export default DashboardWilayahPelangganContent;
