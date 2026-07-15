import React from "react";
import Skeleton from "../Skeleton";

// Admin Event Card Skeleton
export const EventCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-6 flex-1 flex flex-col gap-4">
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div className="space-y-2 mt-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </div>
      <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  </div>
);
