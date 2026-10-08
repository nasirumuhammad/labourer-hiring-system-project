"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { jobsApi } from "@/lib/job";
import { cn } from "cn";

interface SaveJobButtonProps {
  jobId: string;
  initiallySaved?: boolean;
  className?: string;
}

export function SaveJobButton({
  jobId,
  initiallySaved = false,
  className,
}: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [isPending, setIsPending] = useState(false);

  const toggle = async () => {
    if (isPending) return;

    const nextSaved = !isSaved;
    setIsSaved(nextSaved); // optimistic
    setIsPending(true);

    try {
      await (nextSaved ? jobsApi.save(jobId) : jobsApi.unsave(jobId));
    } catch {
      setIsSaved(!nextSaved); // roll back on failure
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Unsave job" : "Save job"}
      className={cn(
        "rounded-full p-2 text-neutral-400 transition-colors hover:bg-white hover:text-[#0B3D2E] disabled:opacity-60",
        isSaved && "text-[#1DBF73]",
        className,
      )}
    >
      <Bookmark className={cn("size-4", isSaved && "fill-current")} />
    </button>
  );
}
