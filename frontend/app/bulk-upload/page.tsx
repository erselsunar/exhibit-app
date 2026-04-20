"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const BASE_URL = "http://127.0.0.1:8000";

interface Row {
  client: string;
  city: string;
  venue: string;
  expo_name: string;
  expo_start_date: string;
  expo_end_date: string;
  expo_management: string;
  booth_no: string;
}

interface PreviewResponse {
  rows: Row[];
  total: number;
}

function openPrint(path: string, row: Row) {
  const params = new URLSearchParams(row as unknown as Record<string, string>);
  window.open(`${path}?${params}`, "_blank");
}

const HEADERS: { key: keyof Row; label: string }[] = [
  { key: "client", label: "Müşteri" },
  { key: "city", label: "Şehir" },
  { key: "venue", label: "Mekan" },
  { key: "expo_name", label: "Fuar Adı" },
  { key: "expo_start_date", label: "Başlangıç" },
  { key: "expo_end_date", label: "Bitiş" },
  { key: "expo_management", label: "Organizatör" },
  { key: "booth_no", label: "Stand No" },
];

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(null);
    setError(null);
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setPreview(null);
    setError(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/bulk-upload/preview`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        setError(err.detail ?? "Yükleme başarısız.");
        return;
      }
      setPreview(await res.json());
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Ana Sayfa
          </Link>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Excel ile Toplu Yükleme</h1>
          <a
            href={`${BASE_URL}/bulk-upload/template`}
            download
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            ⬇ Template İndir
          </a>
        </div>
        <p className="text-gray-500 mb-8">Excel dosyanızı yükleyin, veriler aşağıda önizleme olarak görüntülenecek.</p>

        {/* Expected columns */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-blue-700 mb-2">Beklenen Sütun Başlıkları (1. satır):</p>
          <div className="flex flex-wrap gap-2">
            {["Client", "City", "Venue", "Expo Name", "Expo Start Date", "Expo End Date", "Expo Management", "Booth No"].map(
              (col) => (
                <span key={col} className="bg-white border border-blue-200 text-blue-600 text-xs px-2 py-1 rounded-lg font-mono">
                  {col}
                </span>
              )
            )}
          </div>
          <p className="text-xs text-blue-500 mt-2">Tarih formatı: GG.AA.YYYY veya YYYY-AA-GG</p>
        </div>

        {/* Upload area */}
        <div
          className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center mb-4 cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="space-y-1">
              <p className="text-lg font-medium text-gray-700">📄 {file.name}</p>
              <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="text-xs text-red-400 hover:underline mt-1"
              >
                Dosyayı kaldır
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-4xl">📥</p>
              <p className="text-gray-600 font-medium">Dosya seçmek için tıklayın</p>
              <p className="text-gray-400 text-sm">.xlsx veya .xls</p>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {loading ? "Yükleniyor..." : "Önizle"}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {preview && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Önizleme</h2>
              <span className="text-sm text-gray-400">{preview.total} satır</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-400 font-medium w-8">#</th>
                    {HEADERS.map((h) => (
                      <th key={h.key} className="px-3 py-2 text-left text-gray-500 font-medium whitespace-nowrap">
                        {h.label}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left text-gray-500 font-medium whitespace-nowrap">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-300 text-xs">{i + 1}</td>
                      {HEADERS.map((h) => (
                        <td key={h.key} className="px-3 py-2 text-gray-700 whitespace-nowrap">
                          {row[h.key] || <span className="text-gray-300">—</span>}
                        </td>
                      ))}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openPrint("/print/bol", row)}
                            className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                          >
                            BOL
                          </button>
                          <button
                            onClick={() => openPrint("/print/shipping-tag", row)}
                            className="px-2 py-1 text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                          >
                            Etiket
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
