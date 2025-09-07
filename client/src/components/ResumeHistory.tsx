import React, { useEffect, useMemo, useState } from "react";
import { Eye, Search, Star, TrendingUp } from "lucide-react";
import api from "../utils/api";
import type { ResumeListRow } from "../types/resumes";
import { chip, cx, fmtDate, ratingBadge } from "../utils/fmt";
import DetailsModal from "./DetailsModal";

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="py-4"><div className="h-4 w-28 rounded bg-slate-200" /><div className="mt-1 h-3 w-40 rounded bg-slate-200" /></td>
    <td className="py-4"><div className="h-3 w-48 rounded bg-slate-200" /></td>
    <td className="py-4"><div className="h-6 w-56 rounded bg-slate-200" /></td>
    <td className="py-4"><div className="h-6 w-12 rounded bg-slate-200" /></td>
    <td className="py-4"><div className="h-6 w-12 rounded bg-slate-200" /></td>
    <td className="py-4"><div className="h-3 w-24 rounded bg-slate-200" /></td>
    <td className="py-4"><div className="h-8 w-20 rounded bg-slate-200" /></td>
  </tr>
);

const ResumeHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<ResumeListRow[]>([]);
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const { data } = await api.get<ResumeListRow[]>("/resumes");
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (mounted) setErr(e?.response?.data?.error || e?.message || "Failed to load history");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(r =>
      (r.name || "").toLowerCase().includes(term) ||
      (r.email || "").toLowerCase().includes(term) ||
      (r.file_name || "").toLowerCase().includes(term)
    );
  }, [rows, q]);

  const openDetails = (id: number) => { setOpenId(id); setIsOpen(true); };
  const closeDetails = () => setIsOpen(false);

    if (err){
      alert(err)
    }

  return (
    <section className="w-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Analysis History</h1>
        <p className="text-slate-600">Review and revisit your previous resume analyses</p>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, or filename..."
            className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">File</th>
              <th className="px-4 py-3 font-semibold">Rating</th>
              <th className="px-4 py-3 font-semibold">ATS<br/>Score</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading && (<><SkeletonRow /><SkeletonRow /><SkeletonRow /></>)}

            {!loading && filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={7}>
                  No results{q ? ` for “${q}”` : ""}.
                </td>
              </tr>
            )}

            {!loading && filtered.map((r) => {
              const { chip: ratingChip, icon: ratingIcon } = ratingBadge(r.resume_rating);
              return (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold">{r.name || "-"}</div>
                  </td>
                  <td className="px-4 py-4 align-top text-slate-700">{r.email || "-"}</td>
                  <td className="px-4 py-4 align-top">
                    {r.file_name ? (
                      <span className={cx(chip, "bg-slate-100 text-slate-700 ring-slate-200")}>{r.file_name}</span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className={cx(chip, ratingChip)}>
                      <Star className={cx("h-4 w-4", ratingIcon)} />
                      <span>{Number(r.resume_rating ?? 0).toFixed(1)}/10</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className={cx(chip, "bg-indigo-100 text-indigo-700 ring-indigo-200")}>
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span>{((Number(r.ats_score ?? 0) || 0) / 10).toFixed(1)}/10</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-slate-700">
                    {fmtDate(r.uploaded_at)}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <button
                      onClick={() => openDetails(r.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 transition"
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DetailsModal id={openId} open={isOpen} onClose={closeDetails} />
    </section>
  );
};

export default ResumeHistory;
