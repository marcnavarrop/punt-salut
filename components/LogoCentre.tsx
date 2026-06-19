"use client";

import { useState } from "react";
import type { Centre } from "@/lib/centres";

interface LogoCentreProps {
  centre: Centre | undefined;
  className?: string;
}

export function LogoCentre({ centre, className = "" }: LogoCentreProps) {
  const [errorCarrega, setErrorCarrega] = useState(false);

  if (!centre) return null;

  if (centre.logoUrl && !errorCarrega) {
    return (
      <img
        src={centre.logoUrl}
        alt={centre.nom}
        className={`object-contain ${className}`}
        onError={() => setErrorCarrega(true)}
      />
    );
  }

  return (
    <div
      className={`grid place-items-center text-white ${className}`}
      style={{ backgroundColor: centre.colorPrincipal }}
    >
      {centre.logo}
    </div>
  );
}
