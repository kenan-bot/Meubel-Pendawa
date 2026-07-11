import { useEffect, useState } from "react";

export default function AnimatedProgressBar({
  value = 0,
  max = 100,
  color = "bg-orange-500",
  duration = 1000,
  delay = 150,
}) {
  const [progress, setProgress] = useState(0);

  const percentage =
    max <= 0 ? 0 : Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    setProgress(0);

    const timer = setTimeout(() => {
      setProgress(percentage);
    }, delay);

    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div
      className={`${color} h-full rounded-full`}
      style={{
        width: `${progress}%`,
        transition: `width ${duration}ms ease-out`,
      }}
    />
  );
}
