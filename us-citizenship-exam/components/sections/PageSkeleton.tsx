import { type HTMLAttributes } from 'react';

interface PageSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export default function PageSkeleton({ count = 4, className = '', ...rest }: PageSkeletonProps) {
  return (
    <div className={`space-y-8 ${className}`} {...rest}>
      {/* Title bar skeleton */}
      <div className="h-8 w-48 rounded-xl bg-bg-alt animate-pulse" />

      {/* Pills skeleton */}
      <div className="flex gap-3">
        <div className="h-10 w-24 rounded-xl bg-bg-alt animate-pulse" />
        <div className="h-10 w-28 rounded-xl bg-bg-alt animate-pulse" />
        <div className="h-10 w-20 rounded-xl bg-bg-alt animate-pulse" />
      </div>

      {/* Content blocks with varying widths */}
      {count >= 1 && <div className="h-6 w-full rounded-xl bg-bg-alt animate-pulse" />}
      {count >= 2 && <div className="h-6 w-3/4 rounded-xl bg-bg-alt animate-pulse" />}
      {count >= 3 && <div className="h-6 w-5/6 rounded-xl bg-bg-alt animate-pulse" />}
      {count >= 4 && <div className="h-6 w-2/3 rounded-xl bg-bg-alt animate-pulse" />}

      {/* Card skeleton */}
      <div className="h-64 rounded-2xl bg-bg-alt animate-pulse" />

      {/* More content */}
      <div className="space-y-3">
        <div className="h-4 w-full rounded-xl bg-bg-alt animate-pulse" />
        <div className="h-4 w-5/6 rounded-xl bg-bg-alt animate-pulse" />
        <div className="h-4 w-2/3 rounded-xl bg-bg-alt animate-pulse" />
      </div>
    </div>
  );
}
