import React from "react";
import Skeleton from "../Skeleton";

export const PublicTeamCardSkeleton = () => (
  <div className="w-full sm:w-[280px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
    <Skeleton className="w-16 h-16 rounded-full shrink-0" />
    <div className="flex flex-col gap-2 w-full">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  </div>
);
