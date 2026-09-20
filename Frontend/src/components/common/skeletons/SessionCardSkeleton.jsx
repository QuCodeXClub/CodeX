import React from "react";
import Skeleton from "../Skeleton";

// Session Card Skeleton
export const SessionCardSkeleton = () => (
  <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-4">
    {/* Header Placeholder */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 w-full">
        <Skeleton className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shrink-0" />
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-36 sm:w-48 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <Skeleton className="h-4 w-44 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-6 w-24 rounded-full shrink-0 hidden sm:block" />
    </div>

    {/* Metadata Grid Placeholder */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-3.5 border-t border-border/50">
      <Skeleton className="h-8 w-full rounded-lg" />
      <Skeleton className="h-8 w-full rounded-lg" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>

    {/* Footer / Action Placeholder */}
    <div className="pt-3.5 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <Skeleton className="h-4 w-32 rounded-md" />
      <Skeleton className="h-9 w-full sm:w-32 rounded-xl" />
    </div>
  </div>
);

