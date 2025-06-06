"use client"

import dynamic from "next/dynamic";

export const LocalButton = dynamic(() => import("@/components/ButtonApp"), { ssr: false }) as any;
