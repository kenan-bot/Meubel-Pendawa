import React from "react";
import AnimatedProgressBar from "./AnimatedProgressBar";
import { useState, useEffect } from "react";

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
  const [animatedDelivery, setAnimatedDelivery] = useState(0);
  const [animatedPickup, setAnimatedPickup] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedDelivery(persenDelivery);
      setAnimatedPickup(persenPickup);
    }, 200);

    return () => clearTimeout(timer);
  }, [persenDelivery, persenPickup]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            Delivery vs Pickup
          </h3>
        </div>

        <div className="text-right">
          <div className="text-3xl md:text-4xl font-extrabold text-orange-500 leading-none">
            {totalPesanan}
          </div>

          <div className="text-sm font-medium text-gray-400">Total Pesanan</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mt-2 min-h-0">
        {/* DONUT */}
        <div
          className="
    relative
    flex-shrink-0
    w-[130px]
    h-[130px]
    md:w-[150px]
    md:h-[150px]
    flex
    items-center
    justify-center
  "
        >
          {/* Pickup - luar */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 160">
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
              style={{
                transition: "stroke-dashoffset 1s ease-out",
              }}
              cx="80"
              cy="80"
              r={pickupRadius}
              fill="none"
              stroke="#f97316"
              strokeWidth="14"
              strokeLinecap={persenPickup === 100 ? "butt" : "round"}
              strokeDasharray={pickupCircumference}
              strokeDashoffset={
                (animatedDelivery / 100) * deliveryCircumference
              }
              transform="rotate(-90 80 80)"
            />
          </svg>

          {/* Delivery - dalam */}
          <svg
            className="absolute inset-0 m-auto w-[78%] h-[78%]"
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
              style={{
                transition: "stroke-dashoffset 1s ease-out",
              }}
              cx="60"
              cy="60"
              r={deliveryRadius}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="12"
              strokeLinecap={persenDelivery === 100 ? "butt" : "round"}
              strokeDasharray={deliveryCircumference}
              strokeDashoffset={(animatedPickup / 100) * pickupCircumference}
              transform="rotate(-90 60 60)"
            />
          </svg>
        </div>

        {/* DETAIL */}
        <div className="flex-1 w-full min-w-0">
          <div className="space-y-4">
            {/* PICKUP */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <div className="w-1 h-8 rounded-full bg-orange-500 mt-0.5" />

                <div>
                  <p className="font-semibold text-gray-800">Pickup</p>

                  <p className="text-xs text-gray-400">
                    {persenPickup.toFixed(0)}%
                  </p>

                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <AnimatedProgressBar
                      value={persenPickup}
                      max={100}
                      color="bg-orange-500"
                      duration={1200}
                    />
                  </div>
                </div>
              </div>

              <p className="font-bold text-lg text-gray-800">{totalPickup}</p>
            </div>

            {/* DELIVERY */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <div className="w-1 h-8 rounded-full bg-violet-600 mt-0.5" />

                <div>
                  <p className="font-semibold text-gray-800">Delivery</p>

                  <p className="text-xs text-gray-400">
                    {persenDelivery.toFixed(0)}%
                  </p>

                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <AnimatedProgressBar
                      value={persenDelivery}
                      max={100}
                      color="bg-violet-600"
                      duration={1200}
                    />
                  </div>
                </div>
              </div>

              <p className="font-bold text-lg text-gray-800">{totalDelivery}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardDeliveryVsPickupContent;
