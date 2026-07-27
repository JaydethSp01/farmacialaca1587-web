"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import * as mock from "@/lib/mock";

const RAW: any[] = (() => {
  const m: any = mock;
  const keys = Object.keys(m).filter((k) => Array.isArray(m[k]));
  const want = "pedido";
  const k =
    (keys ?? []).find((x) => x.toLowerCase() === want) ||
    (keys ?? []).find((x) => x.toLowerCase() === want + "s") ||
    (keys ?? []).find((x) => x.toLowerCase().includes(want)) ||
    keys[0];
  const v = k ? m[k] : [];
  return Array.isArray(v) ? v : [];
})();

export default function PedidoPage() {
  const [rows, setRows] = useState<any[]>(RAW);
  const [q, setQ] = useState("");
  const cols = rows[0]
    ? Object.keys(rows[0]).filter((c) => typeof (rows[0] as any)[c] !== "object").slice(0, 6)
    : [];
  const filtered = (rows ?? []).filter((r) =>
    JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Pedido</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar…"
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{rows?.length}</div>
          <div className="text-xs text-gray-500">Total Pedido</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {(cols ?? []).map((c) => (
                <th key={c} className="text-left px-4 py-3 font-medium text-gray-600 capitalize">
                  {c}
                </th>
              ))}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(filtered ?? []).map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60">
                {(cols ?? []).map((c) => (
                  <td key={c} className="px-4 py-3 text-gray-700">
                    {String((r as any)[c] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setRows((p) => (p ?? []).filter((x) => x !== r))}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={cols?.length + 1} className="px-4 py-10 text-center text-gray-400">
                  Sin registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
