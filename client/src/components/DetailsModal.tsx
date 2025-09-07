import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Star, TrendingUp, FileText, BadgeCheck, Lightbulb, Wrench } from "lucide-react";
import api from "../utils/api";
import type{ ResumeFull } from "../types/resumes";
import { chip} from "../utils/fmt";

const Pill: React.FC<{ children: React.ReactNode; tone?: "indigo" | "emerald" | "slate" }> = ({ children, tone = "slate" }) => {
  const tones = {
    indigo: "bg-indigo-100 text-indigo-700 ring-indigo-200",
    emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  } as const;
  return <span className={`${chip} ${tones[tone]} mr-2 mb-2 rounded-2xl`}>{children}</span>;
};

const Section: React.FC<{ title: React.ReactNode; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800">
      {icon}{title}
    </h3>
    {children}
  </div>
);

type Props = { id: number | null; open: boolean; onClose: () => void };

const DetailsModal: React.FC<Props> = ({ id, open, onClose }) => {
  const [data, setData] = useState<ResumeFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const { data } = await api.get<ResumeFull>(`/resumes/${id}`);
        if (!mounted) return;
        setData(data);
        setTimeout(() => closeBtnRef.current?.focus(), 0);
      } catch (e:any) {
        if (mounted) setErr(e?.response?.data?.error || e?.message || "Failed to load details");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [open, id]);

  const areas = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.areas_to_improve)) return data.areas_to_improve;
    if (typeof data.improvement_areas === "string")
      return data.improvement_areas.split(";").map(s => s.trim()).filter(Boolean);
    return [];
  }, [data]);

  if (!open) return null;

  const atsDisplay = (data?.ats_score ?? null) !== null
    ? `${((Number(data?.ats_score) || 0) ).toFixed(1)}/100`
    : "-/100";

  const onOverlayDown = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayDown}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="mx-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Resume Details</h2>
            <p className="text-xs text-slate-500">{data?.file_name ?? "-"}</p>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4 space-y-4">
          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-5 w-1/2 rounded bg-slate-200" />
              <div className="h-24 w-full rounded bg-slate-200" />
              <div className="h-6 w-1/3 rounded bg-slate-200" />
              <div className="h-6 w-1/3 rounded bg-slate-200" />
              <div className="h-40 w-full rounded bg-slate-200" />
            </div>
          )}

          {err && <div className="rounded-md bg-rose-50 p-3 text-rose-700 border border-rose-200 text-sm">{err}</div>}

          {!loading && !err && data && (
            <>
              {/* Top stats */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-slate-600">Candidate</div>
                  <div className="text-sm font-semibold text-slate-900">{data.name ?? "-"}</div>
                  <div className="text-xs text-slate-500">{data.email ?? "-"}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-slate-600">Rating</div>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold">
                    <Star className="h-4 w-4 text-amber-600" />
                    {Number(data.resume_rating ?? 0).toFixed(1)}/10
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs text-slate-600">ATS Score</div>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-md bg-indigo-100 px-2 py-1 text-sm font-semibold text-indigo-700">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    {atsDisplay}
                  </div>
                </div>
              </div>

              {/* Overall Summary */}
              <Section title="Overall Summary" icon={<FileText className="h-4 w-4 text-slate-600" />}>
                <p className="text-sm leading-6 text-slate-700">{data.summary || "—"}</p>
              </Section>

              {/* Strengths & Areas */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Section  title="Strengths" icon={<BadgeCheck className="h-4 w-4 text-emerald-600" />}>
                  {data.strengths?.length ? (
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                      {data.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  ) : <p className="text-sm text-slate-500">—</p>}
                </Section>

                <Section title="Areas to Improve" icon={<Lightbulb className="h-4 w-4 text-amber-600" />}>
                  {areas.length ? (
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                      {areas.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  ) : <p className="text-sm text-slate-500">—</p>}
                </Section>
              </div>

              {/* Skills */}
              <Section title="Skills" icon={<Wrench className="h-4 w-4 text-slate-600" />}>
                <div className="mb-2 text-xs font-semibold text-slate-500">Technical</div>
                <div className="mb-3">
                  {(data.technical_skills || []).map((t, i) => <Pill key={i} tone="indigo">{t}</Pill>)}
                </div>
                <div className="mb-2 text-xs font-semibold text-slate-500">Soft</div>
                <div>
                  {(data.soft_skills || []).map((t, i) => <Pill key={i} tone="emerald">{t}</Pill>)}
                </div>
              </Section>

              {/* Projects */}
              {data.projects?.length ? (
                <Section title="Projects">
                  <div className="space-y-3">
                    {data.projects.map((p, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 p-3">
                        <div className="text-sm font-semibold text-slate-900">{p.title || "Untitled project"}</div>
                        {p.tech?.length ? <div className="mt-2">{p.tech.map((t, j) => <Pill key={j}>{t}</Pill>)}</div> : null}
                        {p.summary ? <p className="mt-2 text-sm text-slate-700">{p.summary}</p> : null}
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
