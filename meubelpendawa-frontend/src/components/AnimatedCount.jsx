import { useEffect, useRef, useState } from "react";

export default function AnimatedCount({
  value = 0,
  duration = 2000,
  formatter,
  className = "",
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    cancelAnimationFrame(animationRef.current);

    const start = performance.now();
    const startValue = 0;
    const endValue = Number(value) || 0;

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);

      const current = startValue + (endValue - startValue) * progress;

      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [value, duration]);

  return (
    <span className={className}>
      {formatter
        ? formatter(displayValue)
        : Math.round(displayValue).toLocaleString("id-ID")}
    </span>
  );
}
