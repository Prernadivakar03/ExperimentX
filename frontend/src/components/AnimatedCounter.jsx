
// components/AnimatedCounter.jsx
import { useState, useEffect } from "react";

export default function AnimatedCounter({ value, duration = 1000, ...props }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Ensure we have a valid number
    let targetValue = 0;
    
    if (typeof value === 'number') {
      targetValue = value;
    } else if (typeof value === 'string') {
      targetValue = parseFloat(value) || 0;
    } else if (value && typeof value === 'object') {
      // If it's a motion value object, try to get its current value
      if ('get' in value && typeof value.get === 'function') {
        targetValue = parseFloat(value.get()) || 0;
      } else if ('current' in value) {
        targetValue = parseFloat(value.current) || 0;
      } else {
        // If it's some other object, try to convert to number
        targetValue = parseFloat(String(value)) || 0;
      }
    }

    // Don't animate if value is the same or invalid
    if (isNaN(targetValue) || displayValue === targetValue) return;

    let startTime;
    const startValue = displayValue;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Cubic ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * eased;
      setDisplayValue(Math.round(current));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  // Ensure we always render a number
  const finalValue = isNaN(displayValue) ? 0 : displayValue;

  return <span {...props}>{finalValue.toLocaleString()}</span>;
}