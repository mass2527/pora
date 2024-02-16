import Image from "next/image";
import React from "react";

export default function PoraLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/pora.svg" alt="Pora 로고" width={24} height={24} />
      <span className="text-xl font-semibold tracking-tight">Pora</span>
    </div>
  );
}
