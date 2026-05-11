import { useRef, useState } from 'react';

interface SwipeOffset {
  x: number;
  y: number;
}

interface UseSwipeGestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  threshold?: number;
}

/**
 * Swipe gesture hook: maps touch gestures to card actions.
 * Swipe left/right = mark unknown/known, swipe up/down = navigate.
 */
export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseSwipeGestureOptions) {
  const [offset, setOffset] = useState<SwipeOffset>({ x: 0, y: 0 });
  const [swiping, setSwiping] = useState(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    setSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - startPos.current.x,
      y: touch.clientY - startPos.current.y,
    });
  };

  const onTouchEnd = () => {
    if (!startPos.current) return;

    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    if (absX > threshold || absY > threshold) {
      // Determine dominant direction
      if (absX > absY) {
        // Horizontal swipe
        if (offset.x < 0) onSwipeLeft();
        else onSwipeRight();
      } else {
        // Vertical swipe
        if (offset.y < 0) onSwipeUp();
        else onSwipeDown();
      }
    }

    startPos.current = null;
    setOffset({ x: 0, y: 0 });
    setSwiping(false);
  };

  return { offset, swiping, onTouchStart, onTouchMove, onTouchEnd };
}
