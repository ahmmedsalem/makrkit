'use client';

import { 
  ArrowLeft, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ArrowType = 'arrow' | 'chevron' | 'double-chevron';
type Direction = 'left' | 'right';

interface DirectionalArrowProps {
  type: ArrowType;
  direction: Direction;
  className?: string;
}

/**
 * A direction-aware arrow component that automatically flips direction for RTL languages
 */
export function DirectionalArrow({ type, direction, className }: DirectionalArrowProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Flip the direction for RTL languages
  const effectiveDirection = isRTL ? (direction === 'left' ? 'right' : 'left') : direction;
  
  if (type === 'arrow') {
    return effectiveDirection === 'right' ? (
      <ArrowRight className={className} />
    ) : (
      <ArrowLeft className={className} />
    );
  }
  
  if (type === 'double-chevron') {
    return effectiveDirection === 'right' ? (
      <ChevronsRight className={className} />
    ) : (
      <ChevronsLeft className={className} />
    );
  }
  
  // Default to chevron
  return effectiveDirection === 'right' ? (
    <ChevronRight className={className} />
  ) : (
    <ChevronLeft className={className} />
  );
}

// Convenience components for common use cases
export function DirectionalArrowRight({ className }: { className?: string }) {
  return <DirectionalArrow type="arrow" direction="right" className={className} />;
}

export function DirectionalArrowLeft({ className }: { className?: string }) {
  return <DirectionalArrow type="arrow" direction="left" className={className} />;
}

export function DirectionalChevronRight({ className }: { className?: string }) {
  return <DirectionalArrow type="chevron" direction="right" className={className} />;
}

export function DirectionalChevronLeft({ className }: { className?: string }) {
  return <DirectionalArrow type="chevron" direction="left" className={className} />;
}

export function DirectionalDoubleChevronRight({ className }: { className?: string }) {
  return <DirectionalArrow type="double-chevron" direction="right" className={className} />;
}

export function DirectionalDoubleChevronLeft({ className }: { className?: string }) {
  return <DirectionalArrow type="double-chevron" direction="left" className={className} />;
}