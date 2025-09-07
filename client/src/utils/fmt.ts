// src/utils/fmt.ts

/** Format ISO date string -> "Sep 6, 2025" */
export const fmtDate = (iso?: string | null) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** Style chips based on rating (resume_rating 1–10) */
export const ratingBadge = (r?: number | null) => {
  const v = Number(r ?? 0);
  if (v >= 7.5) return { chip: "bg-green-100 text-green-700 ring-green-200", icon: "text-green-600" };
  if (v >= 6) return { chip: "bg-amber-100 text-amber-700 ring-amber-200", icon: "text-amber-600" };
  return { chip: "bg-rose-100 text-rose-700 ring-rose-200", icon: "text-rose-600" };
};

/** Base chip style */
export const chip =
  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";

/** Join class names safely */
export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
