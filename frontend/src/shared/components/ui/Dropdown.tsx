import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: '48' | string;
  offset?: number; // vertical offset in px
}

function getScrollParents(el: Element | null): (Window | Element)[] {
  const parents: (Window | Element)[] = [];
  let node: Element | null = el?.parentElement ?? null;
  while (node) {
    const style = getComputedStyle(node);
    const overflowY = style.overflowY;
    if (/(auto|scroll|overlay)/.test(overflowY)) parents.push(node);
    node = node.parentElement;
  }
  parents.push(window);
  return parents;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  width = '48',
  offset = 8,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollParentsRef = useRef<(Window | Element)[]>([]);

  const toggleOpen = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const computePosition = useCallback(() => {
    const trig = triggerRef.current;
    const dd = dropdownRef.current;
    if (!trig || !dd) return;

    const rect = trig.getBoundingClientRect();
    const ddRect = dd.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // default top below trigger
    let top = rect.bottom + offset;
    let left = align === 'left' ? rect.left : rect.right;
    let transform = '';

    // if aligning right we translateX(-100%) so left=rect.right and translateX(-100%)
    if (align === 'right') {
      transform = 'translateX(-100%)';
    } else {
      transform = 'none';
    }

    // Flip up if not enough space below and more space above
    const spaceBelow = vh - rect.bottom;
    const spaceAbove = rect.top;
    const fitsBelow = spaceBelow >= ddRect.height + offset;
    const fitsAbove = spaceAbove >= ddRect.height + offset;
    if (!fitsBelow && fitsAbove) {
      top = rect.top - ddRect.height - offset;
    } else {
      top = rect.bottom + offset;
    }

    // Clamp horizontally so dropdown doesn't go off-screen
    // compute final left in px (if using translateX(-100%) we keep left at rect.right)
    let finalLeft = left;
    if (align === 'left') {
      // ensure dropdown fits on the right
      if (finalLeft + ddRect.width > vw - 8) {
        finalLeft = Math.max(8, vw - ddRect.width - 8);
      }
      if (finalLeft < 8) finalLeft = 8;
      transform = 'none';
    } else {
      // align right with translateX(-100%)
      // but ensure after translate it won't go off left edge
      const projectedLeft = rect.right - ddRect.width; // left after translate
      if (projectedLeft < 8) {
        // disable translate and pin to left edge instead
        finalLeft = 8;
        transform = 'none';
      } else if (rect.right > vw - 8) {
        // if trigger is offscreen to right, shift left to fit
        finalLeft = Math.min(rect.right, vw - 8);
      } else {
        finalLeft = rect.right;
      }
    }

    dd.style.top = `${Math.round(top)}px`;
    dd.style.left = `${Math.round(finalLeft)}px`;
    dd.style.transform = transform;
  }, [align, offset]);

  // throttle updates via rAF
  const scheduleUpdate = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      computePosition();
    });
  }, [computePosition]);

  useEffect(() => {
    if (!isOpen) return;

    // compute initially after open (allow dropdown to mount)
    scheduleUpdate();

    // watch resize of trigger + dropdown (ResizeObserver)
    const ro = new ResizeObserver(() => scheduleUpdate());
    if (triggerRef.current) ro.observe(triggerRef.current);
    if (dropdownRef.current) ro.observe(dropdownRef.current);

    // attach scroll listeners to all scrollable ancestors
    const parents = getScrollParents(triggerRef.current);
    scrollParentsRef.current = parents;
    const onScroll = () => scheduleUpdate();
    parents.forEach((p) => p.addEventListener('scroll', onScroll, { passive: true }));
    window.addEventListener('resize', onScroll, { passive: true });

    // click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      const trg = triggerRef.current;
      const dd = dropdownRef.current;
      if (dd && !dd.contains(e.target as Node) && trg && !trg.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      ro.disconnect();
      parents.forEach((p) => p.removeEventListener('scroll', onScroll));
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isOpen, scheduleUpdate]);

  // cleanup on unmount
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const widthClass = width === '48' ? 'w-48' : width ? `w-${width}` : '';

  return (
    <>
      <div ref={triggerRef} onClick={toggleOpen} style={{ display: 'inline-block' }}>
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            // use fixed so it's positioned relative to viewport and not affected by parent transforms
            style={{
              position: 'fixed',
              zIndex: 9999,
              // top/left/transform are set dynamically in computePosition
            }}
            className={`${widthClass}`}
          >
            <div className="rounded-md shadow-lg ring-1 ring-gray-300 ring-opacity-5 bg-white dark:bg-gray-700">
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Dropdown;
