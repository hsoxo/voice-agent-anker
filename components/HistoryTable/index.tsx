"use client"

import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FileText, Download } from "lucide-react";

export interface Record {
  id: string
  start_time: string
  end_time: string
  type: 'web' | 'twilio'
  from?: string
  to?: string
}


export function HistoryTable({ items }: { items: Record[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string>("");

  const sorted = useMemo(
    () => [...items].sort((a, b) => toMs(b.start_time) - toMs(a.start_time)),
    [items]
  );

  const onOpenTranscript = async (id: string) => {
    setOpenId(id);
    setTranscript("");
    setLoading(true);
    try {
      const res = await fetch(`/api/record/${encodeURIComponent(id)}/transcript`);
      if (!res.ok) throw new Error("Failed to load transcript");
      const data = await res.json();
      setTranscript(data?.data || "(No transcript available)");
    } catch {
      setTranscript("(Failed to load transcript)");
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setOpenId(null);
    setTranscript("");
  };

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Call History</h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-xl">
          <table className="min-w-full text-base">
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <Th>Type</Th>
                <Th>Start time</Th>
                <Th>Duration</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sorted.map((r, i) => (
                <tr
                  key={r.id}
                  className={`${i % 2 === 1 ? "bg-white" : "bg-gray-50/50"
                    } hover:bg-white transition-colors`}
                >
                  <Td><TypeBadge type={r.type} /></Td>
                  <Td>{formatDateTime(r.start_time)}</Td>
                  <Td>{formatDuration(r.start_time, r.end_time)}</Td>
                  <Td>{r.from || "—"}</Td>
                  <Td>{r.to || "—"}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="soft"
                        onClick={() => onOpenTranscript(r.id)}
                        aria-label={`Open transcript for ${r.id}`}
                      >
                        <FileText className="size-4 mr-2" />
                        Transcript
                      </Button>

                      <a
                        href={`/api/record/${encodeURIComponent(r.id)}/recording`}
                        className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset ring-gray-300 hover:ring-gray-400 active:scale-[0.99] transition"
                      >
                        <Download className="size-4 mr-2" />
                        Download recording
                      </a>
                    </div>
                  </Td>
                </tr>
              ))}

              {sorted.length === 0 && (
                <tr>
                  <td className="py-14 text-center text-gray-500" colSpan={6}>
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!openId} onClose={onClose} title="Transcript" onDownload={() => downloadStringAsTxt(transcript, `transcript-${openId}.txt`)}>
        {loading ? (
          <div className="py-12 text-center text-gray-500 text-base">Loading…</div>
        ) : (
          <pre className="whitespace-pre-wrap text-[15px] leading-7 text-gray-800">
            {transcript}
          </pre>
        )}
      </Modal>
    </>
  );
}

/* ------------------------------ UI bits ------------------------------ */

function Th({
  children,
  className = "",
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-6 py-4 align-middle ${className}`} {...rest}>
      {children}
    </td>
  );
}

function TypeBadge({ type }: { type: "web" | "twilio" }) {
  const label = type === "web" ? "Web" : "Twilio";
  const cls =
    type === "web"
      ? "bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-300/70"
      : "bg-sky-600/10 text-sky-700 ring-1 ring-sky-300/70";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = "soft",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "soft";
}) {
  const base =
    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "solid"
      ? "bg-black text-white hover:bg-gray-800 focus:ring-gray-300"
      : "ring-1 ring-inset ring-gray-300 hover:ring-gray-400";
  return (
    <button className={`${base} ${styles}`} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  onDownload
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onDownload?: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-3xl origin-bottom rounded-3xl bg-white shadow-2xl ring-1 ring-gray-200 transition-transform duration-150 ease-out data-[show=true]:scale-100 scale-95">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label="Close transcript modal"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[70vh] overflow-auto px-6 py-5 text-left">{children}</div>
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button onClick={onDownload}>Download</Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Utils ------------------------------ */

function toMs(v: string) {
  // epoch seconds string -> ms；ISO -> ms
  const n = Number(v);
  return Number.isFinite(n) && n > 1e10 ? n : Number.isFinite(n) ? n * 1000 : +new Date(v);
}

function formatDateTime(v: string) {
  return dayjs(toMs(v)).format("MMM D, YYYY HH:mm");
}

function formatDuration(start: string, end: string) {
  const ms = Math.max(0, toMs(end) - toMs(start));
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
export function downloadStringAsTxt(content: string, filename = "file.txt") {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


export default HistoryTable