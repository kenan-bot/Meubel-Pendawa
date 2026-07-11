import { useEffect, useState } from "react";

export default function AnimatedProgressBar({
  value = 0,
  max = 100,
  color = "bg-orange-500",
  background = "bg-gray-200",
  height = "h-2",
  duration = 1000,
  delay = 150,
  rounded = "rounded-full",
  className = "",
}) {
  const [progress, setProgress] = useState(0);

  // Pastikan nilainya tetap di antara 0-100%
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    setProgress(0);

    const timer = setTimeout(() => {
      setProgress(percentage);
    }, delay);

    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div
      className={`w-full overflow-hidden ${background} ${height} ${rounded} ${className}`}
    >
      <div
        className={`${color} ${height} ${rounded}`}
        style={{
          width: `${progress}%`,
          transition: `width ${duration}ms ease-out`,
        }}
      />
    </div>
  );
}
