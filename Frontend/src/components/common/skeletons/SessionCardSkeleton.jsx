import React from "react";
import Skeleton from "../Skeleton";

// Session Card Skeleton
export const SessionCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div className="flex items-start gap-4 w-full">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
    <Skeleton className="h-10 w-full md:w-32 rounded-lg shrink-0" />
  </div>
);
