"use client";
import dynamic from "next/dynamic";
export default dynamic(() => import("./ApyCalculator"), { ssr: false });
