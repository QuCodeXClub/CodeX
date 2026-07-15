import React from "react";
import Skeleton from "../Skeleton";

// Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr>
    <td className="px-6 py-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-48" />
      </div>
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-6 w-32 rounded" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-6 w-20 rounded-full" />
    </td>
    <td className="px-6 py-4">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    </td>
  </tr>
);
