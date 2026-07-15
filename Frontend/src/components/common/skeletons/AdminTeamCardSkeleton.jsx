import React from "react";
import Skeleton from "../Skeleton";

// Team Card Skeleton
export const AdminTeamCardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
    <Skeleton className="h-56 w-full rounded-none" />
    <div className="p-5 flex-1 flex flex-col gap-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3 mt-1" />
      <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  </div>
);
