import { useState, useEffect } from "react";

type CountdownProps = {
  targetDate: string; 
}

const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const parseDate = (dateStr: string): Date => {
    const [month, day, year, time, period] = dateStr.split(/[\s,]+/);
    const months: Record<string, number> = {
      Jan: 0, 
      Feb: 1, 
      Mar: 2, 
      Apr: 3, 
      May: 4, 
      Jun: 5,
      Jul: 6, 
      Aug: 7, 
      Sep: 8, 
      Oct: 9, 
      Nov: 10, 
      Dec: 11
    };

    let [hours, minutes] = time.split(":").map(Number);

    if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (period.toLowerCase() === "am" && hours === 12) hours = 0;

    return new Date(Number(year), months[month], Number(day), hours, minutes);
  };

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const futureDate = parseDate(targetDate).getTime();
    const timeLeft = futureDate - now;

    return {
      days: Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      minutes: Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))),
      seconds: Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000)),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="text-center text-lg font-medium text-red-500">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default CountdownTimer;