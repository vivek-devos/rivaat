import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Crown } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hoverState, setHoverState] = useState<'default' | 'clickable' | 'trial' | 'view' | 'shop'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('RIVAAT');
  const [isVisible, setIsVisible] = useState(false);

  // Direct DOM references for 144Hz zero-lag hardware-accelerated movement
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Pure mutable coordinates (NO React state re-renders on mousemove!)
  const mouse = useRef({ x: -100, y: -100 });
  const trail = useRef({ x: -100, y: -100 });
  const currentHover = useRef<'default' | 'clickable' | 'trial' | 'view' | 'shop'>('default');
  currentHover.current = hoverState;
  const isMoving = useRef(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!isMoving.current) {
        setIsVisible(true);
        isMoving.current = true;
      }

      // Check context under cursor (Only update React state when state actually CHANGES!)
      const target = e.target as HTMLElement | null;
      if (target) {
        const cursorData = target.closest('[data-cursor]')?.getAttribute('data-cursor');
        const isClickable = target.closest('button, a, input, select, textarea, [role="button"]');

        let nextState: 'default' | 'clickable' | 'trial' | 'view' | 'shop' = 'default';
        let nextLabel = 'RIVAAT';

        if (cursorData === 'trial') {
          nextState = 'trial';
          nextLabel = 'TRY AT HOME ₹0';
        } else if (cursorData === 'view') {
          nextState = 'view';
          nextLabel = 'INSPECT FABRIC';
        } else if (cursorData === 'shop') {
          nextState = 'shop';
          nextLabel = 'EXPLORE DUKAAN';
        } else if (isClickable) {
          nextState = 'clickable';
          nextLabel = 'SELECT';
        }

        if (currentHover.current !== nextState) {
          setHoverState(nextState);
          setCursorLabel(nextLabel);
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // High performance RAF loop: direct transform3d updates (0ms latency)
    const animate = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Update center dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0px) translate(-50%, -50%)`;
      }

      // Snappy lerp for trailing gold ring (factor 0.32 for responsive luxury feel)
      trail.current.x += (mx - trail.current.x) * 0.32;
      trail.current.y += (my - trail.current.y) * 0.32;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0px) translate(-50%, -50%)`;
      }

      // Update label pill
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${mx + 14}px, ${my + 14}px, 0px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  const isSpecial = hoverState !== 'default';

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'opacity' }}
    >
      {/* 1. Trailing Outer Luxury Golden Ring */}
      <div
        ref={ringRef}
        className={`absolute top-0 left-0 rounded-full pointer-events-none transition-all duration-150 ease-out border ${
          hoverState === 'trial'
            ? 'w-12 h-12 border-emerald-500 bg-emerald-500/15 scale-125 shadow-[0_0_16px_rgba(16,185,129,0.35)]'
            : hoverState === 'view'
            ? 'w-12 h-12 border-amber-500 bg-amber-500/15 scale-125 shadow-[0_0_16px_rgba(245,158,11,0.35)]'
            : hoverState === 'clickable'
            ? 'w-10 h-10 border-orange-500 bg-orange-500/10 scale-110 shadow-[0_0_10px_rgba(234,88,12,0.25)]'
            : 'w-8 h-8 border-amber-400/80 bg-amber-400/10 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
        }`}
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0px) translate(-50%, -50%)',
        }}
      />

      {/* 2. Precise Hardware-Accelerated Center Dot */}
      <div
        ref={dotRef}
        className={`absolute top-0 left-0 rounded-full pointer-events-none bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)] transition-transform duration-75 ${
          isSpecial ? 'w-2 h-2' : 'w-2 h-2'
        }`}
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0px) translate(-50%, -50%)',
        }}
      />

      {/* 3. Branded Luxury Cursor Label Pill */}
      <div
        ref={labelRef}
        className="absolute top-0 left-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xl pointer-events-none transition-colors duration-150 border"
        style={{
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0px)',
          backgroundColor:
            hoverState === 'trial'
              ? 'rgba(6, 78, 59, 0.92)'
              : hoverState === 'view'
              ? 'rgba(120, 53, 15, 0.92)'
              : hoverState === 'clickable'
              ? 'rgba(28, 25, 23, 0.92)'
              : 'rgba(20, 18, 16, 0.88)',
          borderColor:
            hoverState === 'trial'
              ? 'rgba(52, 211, 153, 0.5)'
              : hoverState === 'view'
              ? 'rgba(245, 158, 11, 0.6)'
              : 'rgba(245, 158, 11, 0.35)',
        }}
      >
        {hoverState === 'trial' ? (
          <Sparkles size={11} className="text-emerald-300 animate-spin" />
        ) : hoverState === 'view' ? (
          <Sparkles size={11} className="text-amber-300" />
        ) : (
          <Crown size={11} className="text-amber-400" />
        )}
        <span className="text-[9px] font-bold tracking-widest uppercase font-serif text-amber-200">
          {cursorLabel}
        </span>
      </div>
    </div>
  );
};
