import type { Job } from "@/types/job";

export function formatPay(
  job: Pick<Job, "minPay" | "maxPay" | "paymentType">,
): string {
  const min = Number(job.minPay).toLocaleString("en-NG");
  const max = Number(job.maxPay).toLocaleString("en-NG");
  const suffix = job.paymentType === "hourly" ? "/ hour" : "/ project";
  return `₦${min} – ₦${max} ${suffix}`;
}
