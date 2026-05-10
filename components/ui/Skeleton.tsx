import React, { HTMLAttributes } from 'react';

export const Skeleton = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`animate-pulse rounded-[16px] bg-muted ${className}`}
      {...props}
    />
  );
};
