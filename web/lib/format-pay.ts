import type { Job } from "@/types/job";

export function formatPay(
  job: Pick<Job, "minPay" | "maxPay" | "paymentType">,
): string {
  const min = Number(job.minPay).toLocaleString();
  const max = Number(job.maxPay).toLocaleString();
  const suffix = job.paymentType === "hourly" ? "per hour" : "per project";
  return `$${min} – $${max} ${suffix}`;
}
