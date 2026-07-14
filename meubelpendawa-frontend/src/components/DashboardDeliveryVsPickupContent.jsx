import React from "react";

function DashboardDeliveryVsPickupContent({
  totalPesanan = 0,
  totalPickup = 0,
  totalDelivery = 0,
  persenPickup = 0,
  persenDelivery = 0,
}) {
  const pickupRadius = 60;
  const pickupCircumference = 2 * Math.PI * pickupRadius;

  const deliveryRadius = 42;
  const deliveryCircumference = 2 * Math.PI * deliveryRadius;

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div>
        <h3 className="font-bold text-xl text-gray-800">Delivery vs Pickup</h3>

        <p className="text-sm text-gray-400">Distribusi metode pengiriman</p>
      </div>

      {/* TOTAL */}
      <div className="mt-3">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          Total Pesanan
        </p>

        <h2 className="text-3xl font-extrabold text-gray-800">
          {totalPesanan}
        </h2>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-between mt-2 gap-4">
        {/* DONUT */}
        <div className="relative w-[160px] h-[160px] flex items-center justify-center">
          {/* Pickup - luar */}
          <svg
            className="absolute"
            width="160"
            height="160"
            viewBox="0 0 160 160"
          >
            {/* track */}
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="14"
            />

            {/* progress */}
            <circle
              cx="80"
              cy="80"
              r={pickupRadius}
              fill="none"
              stroke="#f97316"
              strokeWidth="14"
              strokeLinecap={persenPickup === 100 ? "butt" : "round"}
              strokeDasharray={pickupCircumference}
              strokeDashoffset={
                pickupCircumference - (persenPickup / 100) * pickupCircumference
              }
              transform="rotate(-90 80 80)"
            />
          </svg>

          {/* Delivery - dalam */}
          <svg
            className="absolute"
            width="120"
            height="120"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="42"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="12"
            />

            <circle
              cx="60"
              cy="60"
              r={deliveryRadius}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="12"
              strokeLinecap={persenDelivery === 100 ? "butt" : "round"}
              strokeDasharray={deliveryCircumference}
              strokeDashoffset={
                deliveryCircumference -
                (persenDelivery / 100) * deliveryCircumference
              }
              transform="rotate(-90 60 60)"
            />
          </svg>
        </div>

        {/* DETAIL */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-700 mb-4">
            Distribusi Pesanan
          </h4>

          <div className="space-y-4">
            {/* PICKUP */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-8 rounded-full bg-orange-500 mt-0.5" />

                <div>
                  <p className="font-semibold text-gray-800">Pickup</p>

                  <p className="text-xs text-gray-400">
                    {persenPickup.toFixed(0)}%
                  </p>
                </div>
              </div>

              <p className="font-bold text-gray-800">{totalPickup}</p>
            </div>

            {/* DELIVERY */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-8 rounded-full bg-violet-600 mt-0.5" />

                <div>
                  <p className="font-semibold text-gray-800">Delivery</p>

                  <p className="text-xs text-gray-400">
                    {persenDelivery.toFixed(0)}%
                  </p>
                </div>
              </div>

              <p className="font-bold text-gray-800">{totalDelivery}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardDeliveryVsPickupContent;
