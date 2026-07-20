'use client';

export function CardSkeleton() {
  return (
    <div className="bg-background-card border border-border rounded-custom p-4 flex flex-col gap-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-border-muted rounded-custom w-full" />
      {/* Title & Specs */}
      <div className="h-4 bg-border-muted rounded w-3/4" />
      <div className="h-3 bg-border-muted rounded w-1/2" />
      {/* Pricing */}
      <div className="flex justify-between items-center mt-2">
        <div className="h-5 bg-border-muted rounded w-1/3" />
        <div className="h-8 bg-border-muted rounded-custom w-1/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative w-full h-[60vh] bg-background-card animate-pulse flex items-center justify-center border-b border-border">
      <div className="flex flex-col items-center gap-4 max-w-xl w-full px-6">
        <div className="h-6 bg-border-muted rounded w-1/4" />
        <div className="h-10 bg-border-muted rounded w-3/4" />
        <div className="h-12 bg-border-muted rounded-custom w-1/3 mt-4" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse py-8">
      {/* Gallery */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="aspect-square bg-border-muted rounded-custom w-full" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-border-muted rounded-custom" />
          ))}
        </div>
      </div>
      {/* Info */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="h-8 bg-border-muted rounded w-3/4" />
        <div className="h-5 bg-border-muted rounded w-1/4" />
        <div className="h-16 bg-border-muted rounded w-full" />
        <hr className="border-border" />
        <div className="space-y-3">
          <div className="h-4 bg-border-muted rounded w-1/2" />
          <div className="h-4 bg-border-muted rounded w-2/3" />
          <div className="h-4 bg-border-muted rounded w-1/3" />
        </div>
        <div className="h-12 bg-border-muted rounded-custom w-1/2 mt-4" />
      </div>
    </div>
  );
}
