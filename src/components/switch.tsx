import React, { ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function Switch<T extends Record<string, ReactNode>>({
  cases,
  value,
  shouldPreserveState = true,
  fallback,
}: {
  cases: T;
  value: keyof T | Omit<string, keyof T>;
  shouldPreserveState?: boolean;
  fallback?: ReactNode;
}) {
  const caseNames = Object.keys(cases);
  const hasMatchedCaseName = caseNames.some((caseName) => caseName === value);
  if (!hasMatchedCaseName) {
    return fallback;
  }

  return caseNames.map((key) => {
    if (shouldPreserveState) {
      return (
        <div
          key={key}
          className={cn({
            hidden: key !== value,
          })}
        >
          {cases[key]}
        </div>
      );
    } else {
      if (key !== value) {
        return null;
      }

      return <div key={key}>{cases[key]}</div>;
    }
  });
}
