import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  return (
    <div>
      <Link href="/dashboard/new">블로그 생성</Link>
    </div>
  );
}
