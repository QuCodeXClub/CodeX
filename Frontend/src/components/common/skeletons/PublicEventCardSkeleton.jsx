import React from "react";
import Skeleton from "../Skeleton";

// Public Event Card Skeleton
export const PublicEventCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] border-2 border-gray-200 p-4 flex flex-col md:flex-row gap-8 shadow-sm">
    <Skeleton className="w-full md:w-[320px] h-[220px] shrink-0 rounded-3xl" />
    <div className="flex-1 flex flex-col justify-center py-2 pr-4">
      <Skeleton className="h-5 w-20 rounded-full mb-3" />
      <Skeleton className="h-8 w-3/4 rounded-lg mb-4" />
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  </div>
);
