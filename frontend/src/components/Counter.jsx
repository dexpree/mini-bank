import { useEffect, useState } from "react";

export default function Counter({ value, duration = 800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value);

    if (isNaN(end)) return;

    const stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 500;
      setCount(start);

      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, stepTime > 10 ? stepTime : 10);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}
