import React from "react";

const pulseBase = "animate-pulse bg-gray-200 rounded-md";

export const SkeletonImage = ({ className = "" }) => (
  <div className={`${pulseBase} ${className}`} />
);

export const SkeletonText = ({ className = "" }) => (
  <div className={`${pulseBase} ${className}`} />
);

export const SkeletonButton = ({ className = "" }) => (
  <div className={`${pulseBase} ${className}`} />
);

export const SkeletonProductCard = () => (
  <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/80 flex flex-col h-full">
    <div className="relative w-full h-52 sm:h-56 overflow-hidden shrink-0">
      <div className={`absolute inset-0 ${pulseBase} rounded-none`} />
    </div>
    <div className="flex flex-col flex-grow px-4 pt-3 pb-4 gap-2">
      <SkeletonText className="h-5 w-3/4 rounded-lg" />
      <SkeletonText className="h-4 w-full rounded-lg" />
      <SkeletonText className="h-4 w-5/6 rounded-lg" />
      <SkeletonText className="h-6 w-32 rounded-full" />
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <SkeletonText className="h-6 w-20 rounded-lg" />
          <SkeletonText className="h-3 w-16 rounded-lg" />
        </div>
        <SkeletonButton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  </div>
);

export const SkeletonFilterPanel = () => (
  <div className="flex flex-col gap-8">
    <div>
      <SkeletonText className="h-4 w-24 mb-4" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonText key={i} className="h-10 w-full rounded-xl" />
        ))}
      </div>
    </div>
    <div>
      <SkeletonText className="h-4 w-24 mb-4" />
      <div className="flex items-center justify-between mb-3">
        <SkeletonText className="h-3 w-10" />
        <SkeletonText className="h-3 w-10" />
      </div>
      <SkeletonText className="h-2 w-full mb-4" />
      <SkeletonText className="h-8 w-28 rounded-lg" />
    </div>
    <div>
      <SkeletonText className="h-4 w-20 mb-4" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonButton key={i} className="h-8 w-28 rounded-xl" />
        ))}
      </div>
    </div>
    <SkeletonButton className="h-12 w-full rounded-xl" />
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="border-b border-gray-50">
    <td className="px-5 py-3 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <SkeletonImage className="w-10 h-10 rounded" />
        <SkeletonText className="h-4 w-32" />
      </div>
    </td>
    <td className="px-5 py-3">
      <SkeletonText className="h-3 w-40" />
    </td>
    <td className="px-5 py-3">
      <SkeletonText className="h-4 w-20" />
    </td>
    <td className="px-5 py-3">
      <SkeletonText className="h-4 w-10" />
    </td>
    <td className="px-5 py-3">
      <SkeletonText className="h-4 w-24" />
    </td>
    <td className="px-5 py-3">
      <SkeletonButton className="h-5 w-14 rounded-full" />
    </td>
    <td className="px-5 py-3">
      <SkeletonText className="h-4 w-16" />
    </td>
    <td className="px-5 py-3 text-right whitespace-nowrap">
      <div className="flex justify-end gap-1">
        <SkeletonButton className="h-7 w-7 rounded" />
        <SkeletonButton className="h-7 w-7 rounded" />
      </div>
    </td>
  </tr>
);

export const SkeletonStatCard = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4">
    <SkeletonImage className="w-10 h-10 rounded-lg" />
    <div className="flex flex-col gap-2">
      <SkeletonText className="h-6 w-16" />
      <SkeletonText className="h-3 w-24" />
    </div>
  </div>
);

export const SkeletonDashboardProductRow = () => (
  <tr className="border-b border-gray-50">
    <td className="px-5 py-3"><SkeletonText className="h-4 w-32" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-4 w-20" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-4 w-10" /></td>
    <td className="px-5 py-3"><SkeletonButton className="h-5 w-14 rounded-full" /></td>
  </tr>
);

export const SkeletonDashboardOrderRow = () => (
  <tr className="border-b border-gray-50">
    <td className="px-5 py-3"><SkeletonText className="h-4 w-24" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-4 w-28" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-4 w-20" /></td>
    <td className="px-5 py-3"><SkeletonButton className="h-5 w-20 rounded-full" /></td>
  </tr>
);

export const SkeletonCategoryRow = () => (
  <tr className="border-b border-gray-50">
    <td className="px-5 py-3"><SkeletonText className="h-4 w-28" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-3 w-20" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-4 w-24" /></td>
    <td className="px-5 py-3 text-right whitespace-nowrap">
      <div className="flex justify-end gap-1">
        <SkeletonButton className="h-7 w-7 rounded" />
        <SkeletonButton className="h-7 w-7 rounded" />
      </div>
    </td>
  </tr>
);

export const SkeletonDealRow = () => (
  <tr className="border-b border-gray-50">
    <td className="px-5 py-3"><SkeletonText className="h-4 w-32" /></td>
    <td className="px-5 py-3"><SkeletonButton className="h-5 w-16 rounded" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-4 w-24" /></td>
    <td className="px-5 py-3"><SkeletonText className="h-4 w-24" /></td>
    <td className="px-5 py-3 text-right whitespace-nowrap">
      <div className="flex justify-end gap-1">
        <SkeletonButton className="h-7 w-7 rounded" />
        <SkeletonButton className="h-7 w-7 rounded" />
      </div>
    </td>
  </tr>
);

export const SkeletonOrderRow = () => (
  <tr className="border-b border-gray-50">
    <td className="px-5 py-5"><SkeletonText className="h-4 w-24" /></td>
    <td className="px-5 py-5"><SkeletonText className="h-4 w-28" /></td>
    <td className="px-5 py-5"><SkeletonText className="h-4 w-24" /></td>
    <td className="px-5 py-5"><SkeletonText className="h-4 w-20" /></td>
    <td className="px-5 py-5"><SkeletonButton className="h-5 w-24 rounded-xl" /></td>
  </tr>
);
