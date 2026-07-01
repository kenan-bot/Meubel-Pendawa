import { useEffect, useState } from "react";

const DateTimeDisplay = ({ className = "" }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const tanggal = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jam = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className={`text-[9px] md:text-[16px] font-medium text-black whitespace-nowrap ${className}`}
    >
      {tanggal} • Pukul {jam}
    </div>
  );
};

export default DateTimeDisplay;