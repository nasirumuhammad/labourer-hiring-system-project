"use client";

import { useEffect, useRef } from "react";
import type { ApplicationStatus } from "@/types/job";

export interface ApplicationStatusUpdate {
  applicationId: string;
  applicantId: string;
  jobId: string;
  status: ApplicationStatus;
}

export function useApplicationStatusStream(
  onUpdate: (update: ApplicationStatusUpdate) => void,
) {
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const source = new EventSource("/api/bff/applications/stream");

    source.onopen = () => {
      console.log("[SSE] connection opened");
    };

    source.onerror = (err) => {
      console.log(
        "[SSE] connection error",
        err,
        "readyState:",
        source.readyState,
      );
    };

    source.onmessage = (event) => {
      console.log("[SSE] unnamed message event (no event: field):", event.data);
    };

    const handleUpdate = (event: MessageEvent<string>) => {
      console.log("[SSE] application-status-updated received:", event.data);
      try {
        const payload = JSON.parse(event.data) as ApplicationStatusUpdate;
        onUpdateRef.current(payload);
      } catch {
        // Malformed payload — ignore rather than crash the stream handler.
      }
    };

    source.addEventListener("application-status-updated", handleUpdate);

    return () => {
      source.removeEventListener("application-status-updated", handleUpdate);
      source.close();
    };
  }, []);
  // useEffect(() => {
  //   const source = new EventSource("/api/bff/applications/stream");

  //   const handleUpdate = (event: MessageEvent<string>) => {
  //     try {
  //       const payload = JSON.parse(event.data) as ApplicationStatusUpdate;
  //       onUpdateRef.current(payload);
  //     } catch {
  //       // Malformed payload — ignore rather than crash the stream handler.
  //     }
  //   };

  //   source.addEventListener("application-status-updated", handleUpdate);

  //   return () => {
  //     source.removeEventListener("application-status-updated", handleUpdate);
  //     source.close();
  //   };
  // }, []);
}
