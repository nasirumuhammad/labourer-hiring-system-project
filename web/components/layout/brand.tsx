import Link from "next/link";
import { cn } from "cn";

export function Brand({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-semibold text-brand", className)}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-brand text-sm text-white">
        J
      </span>
      JobLink
    </Link>
  );
}
