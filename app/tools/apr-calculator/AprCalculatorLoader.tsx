"use client";
import dynamic from "next/dynamic";
export default dynamic(() => import("./AprCalculator"), { ssr: false });
