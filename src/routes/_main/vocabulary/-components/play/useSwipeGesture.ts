import { useRef, useState } from 'react';

interface SwipeOffset {
  x: number;
  y: number;
}

type Axis = 'horizontal' | 'vertical' | null;

interface UseSwipeGestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  threshold?: number;
}

const LOCK_DEADZONE = 10;

/**
 * Swipe gesture hook with axis locking.
 * Once the user moves past the deadzone on one axis, the other axis is locked out.
 * This prevents diagonal ambiguity (e.g. swipe up-right).
 */
export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseSwipeGestureOptions) {
  const [offset, setOffset] = useState<SwipeOffset>({ x: 0, y: 0 });
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const lockedAxis = useRef<Axis>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    lockedAxis.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startPos.current.x;
    const dy = touch.clientY - startPos.current.y;

    // Lock axis once past deadzone
    if (!lockedAxis.current) {
      if (Math.abs(dx) > LOCK_DEADZONE || Math.abs(dy) > LOCK_DEADZONE) {
        lockedAxis.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
      }
    }

    // Only allow movement on the locked axis
    if (lockedAxis.current === 'horizontal') {
      setOffset({ x: dx, y: 0 });
    } else if (lockedAxis.current === 'vertical') {
      setOffset({ x: 0, y: dy });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const onTouchEnd = () => {
    if (!startPos.current) return;

    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    if (absX > threshold || absY > threshold) {
      if (lockedAxis.current === 'horizontal') {
        if (offset.x < 0) onSwipeLeft();
        else onSwipeRight();
      } else if (lockedAxis.current === 'vertical') {
        if (offset.y < 0) onSwipeUp();
        else onSwipeDown();
      }
    }

    startPos.current = null;
    lockedAxis.current = null;
    setOffset({ x: 0, y: 0 });
  };

  return { offset, onTouchStart, onTouchMove, onTouchEnd };
}
