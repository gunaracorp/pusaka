"use client";

// ============================================================
// PUSAKA CMS — Log Verifikasi (read-only)
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ScanSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listAdminVerifyLogs, type AdminVerifyLogT } from "@/lib/admin-api";
import { formatDateTime, timeAgo } from "@/lib/pusaka";
import { toast } from "sonner";

export function AdminVerifyLogs() {
  const [items, setItems] = useState<AdminVerifyLogT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await listAdminVerifyLogs();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat log verifikasi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const validCount = items?.filter((l) => l.result === "VALID").length ?? 0;
  const invalidCount = items?.filter((l) => l.result !== "VALID").length ?? 0;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
            <ScanSearch className="h-5 w-5 text-emerald-700" aria-hidden />
            Log Verifikasi Sertifikat
          </h2>
          <p className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
            Riwayat verifikasi QR — hanya dibaca.
            <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
              {validCount} VALID
            </Badge>
            <Badge className="border-red-200 bg-red-100 text-red-700">{invalidCount} INVALID</Badge>
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
          disabled={refreshing}
          onClick={() => load(true)}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
          Muat Ulang
        </Button>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <ScanSearch className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">Belum ada log verifikasi.</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[640px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead>No. Sertifikat</TableHead>
                <TableHead>Hasil</TableHead>
                <TableHead>Waktu (relatif)</TableHead>
                <TableHead>Waktu (lengkap)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((log) => {
                const valid = log.result === "VALID";
                return (
                  <TableRow key={log.id} className="hover:bg-emerald-50/40">
                    <TableCell className="font-mono text-xs font-bold text-stone-700">
                      {log.certNumber}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          valid
                            ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                            : "border-red-200 bg-red-100 text-red-700"
                        }
                      >
                        {log.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-stone-600">
                      {timeAgo(log.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-stone-500">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
