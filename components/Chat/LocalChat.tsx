"use client"

import dynamic from "next/dynamic";

export const LocalChat = dynamic(() => import("@/components/Chat"), { ssr: false }) as any;
