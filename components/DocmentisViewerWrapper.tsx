"use client";

import dynamic from "next/dynamic";

const DocmentisViewer = dynamic(() => import("./DocmentisViewer"), { ssr: false });

export interface DocmentisViewerWrapperProps {
  project?: {
    id?: string;
    title?: string;
    summary?: string;
    impact?: string;
    stack?: string[];
  };
}

export default function DocmentisViewerWrapper() {
  return <DocmentisViewer />;
}
