import { useEffect, useState } from "react";
import { istanbulDay } from "./current-day.mjs";
export function useCurrentDay() {
  const [day, setDay] = useState(istanbulDay);
  useEffect(() => {
    const update = () => setDay(istanbulDay());
    const timer = setInterval(update, 30000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return day;
}
