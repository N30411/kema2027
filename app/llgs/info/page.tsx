import { Suspense } from "react";
import LLGInfoClient from "./LLGInfoClient";

export default function LLGInfoPage() {
  return (
    <Suspense>
      <LLGInfoClient />
    </Suspense>
  );
}
