import type { Metadata } from "next";
import HomolosineLoader from "./components/HomolosineLoader";

export const metadata: Metadata = {
  title: "Baird Langenbrunner",
};

export default function Home() {
  return (
    <>
      <h1 className="sr-only">Baird Langenbrunner</h1>
      <HomolosineLoader />
    </>
  );
}
