'use client';

import { useState, useEffect, useCallback } from 'react';

interface CountdownProps {
  targetDate: string;
  onExpiry?: () => void;
  className?: string;
  showLabels?: boolean;
}

export default function Countdown({ targetDate, onExpiry, className = '', showLabels = false }: CountdownProps) {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      
      if (updated.expired) {
        clearInterval(timer);
        if (onExpiry) onExpiry();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, onExpiry]);

  if (timeLeft.expired) {
    return (
      <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
        Đã đóng Pre-order
      </span>
    );
  }

  const pad = (num: number) => String(num).padStart(2, '0');

  if (showLabels) {
    return (
      <div className={`flex gap-3 text-center ${className}`}>
        <div className="bg-background-card border border-border px-3 py-2 rounded-custom min-w-[55px]">
          <div className="text-lg font-bold text-accent">{pad(timeLeft.days)}</div>
          <div className="text-[10px] text-foreground-muted uppercase">Ngày</div>
        </div>
        <div className="bg-background-card border border-border px-3 py-2 rounded-custom min-w-[55px]">
          <div className="text-lg font-bold text-accent">{pad(timeLeft.hours)}</div>
          <div className="text-[10px] text-foreground-muted uppercase">Giờ</div>
        </div>
        <div className="bg-background-card border border-border px-3 py-2 rounded-custom min-w-[55px]">
          <div className="text-lg font-bold text-accent">{pad(timeLeft.minutes)}</div>
          <div className="text-[10px] text-foreground-muted uppercase">Phút</div>
        </div>
        <div className="bg-background-card border border-border px-3 py-2 rounded-custom min-w-[55px]">
          <div className="text-lg font-bold text-accent">{pad(timeLeft.seconds)}</div>
          <div className="text-[10px] text-foreground-muted uppercase">Giây</div>
        </div>
      </div>
    );
  }

  return (
    <span className={`font-mono text-xs font-bold text-accent tracking-wider ${className}`}>
      Còn lại: {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
    </span>
  );
}
