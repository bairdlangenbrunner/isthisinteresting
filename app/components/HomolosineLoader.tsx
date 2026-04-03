"use client";

import dynamic from "next/dynamic";

const Homolosines = dynamic(() => import("./Homolosines"), { ssr: false });

export default function HomolosineLoader() {
  return <Homolosines />;
}
