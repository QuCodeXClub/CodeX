import React from "react";
import Skeleton from "../Skeleton";

// FAQ Skeleton
export const FaqSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start gap-6">
    <div className="flex-1 w-full gap-3 flex flex-col">
      <div className="flex gap-3 items-center">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="flex gap-2 shrink-0">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);
