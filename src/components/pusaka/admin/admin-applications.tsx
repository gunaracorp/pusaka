"use client";

// ============================================================
// PUSAKA CMS — Pengajuan: daftar, filter, ubah status, hapus
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileStack, Loader2, RefreshCw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_META,
  deleteAdminApplication,
  listAdminApplications,
  updateAdminApplicationStatus,
  type AdminApplicationT,
} from "@/lib/admin-api";
import { formatDateShort } from "@/lib/pusaka";
import { toast } from "sonner";

const TYPE_BADGE: Record<string, string> = {
  PERUSAHAAN: "bg-emerald-100 text-emerald-800 border-emerald-200",
  INDIVIDU: "bg-teal-100 text-teal-800 border-teal-200",
};

export function AdminApplications() {
  const [items, setItems] = useState<AdminApplicationT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [deleting, setDeleting] = useState<AdminApplicationT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [patchingId, setPatchingId] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await listAdminApplications();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat pengajuan.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (statusFilter === "SEMUA") return items;
    return items.filter((a) => a.status === statusFilter);
  }, [items, statusFilter]);

  async function handleStatusChange(app: AdminApplicationT, status: string) {
    if (status === app.status) return;
    setPatchingId(app.id);
    try {
      await updateAdminApplicationStatus(app.id, status);
      setItems((prev) =>
        prev ? prev.map((a) => (a.id === app.id ? { ...a, status } : a)) : prev,
      );
      toast.success("Status diperbarui", {
        description: `${app.trackingCode} → ${APPLICATION_STATUS_META[status]?.label ?? status}`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengubah status.");
    } finally {
      setPatchingId(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminApplication(deleting.id);
      toast.success("Pengajuan dihapus", { description: deleting.trackingCode });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus pengajuan.");
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Heading + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
            <FileStack className="h-5 w-5 text-emerald-700" aria-hidden />
            Pengajuan Sertifikasi
          </h2>
          <p className="text-sm text-stone-500">
            Pantau &amp; proses pengajuan dari perusahaan dan individu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-44"
              aria-label="Filter status pengajuan"
            >
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEMUA">Semua Status</SelectItem>
              {APPLICATION_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {APPLICATION_STATUS_META[s]?.label ?? s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
            aria-label="Muat ulang daftar pengajuan"
            disabled={refreshing}
            onClick={() => load(true)}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
          </Button>
        </div>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <FileStack className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">
            {statusFilter === "SEMUA"
              ? "Belum ada pengajuan masuk."
              : "Tidak ada pengajuan dengan status ini."}
          </p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[1000px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((app) => {
                const meta = APPLICATION_STATUS_META[app.status];
                const patching = patchingId === app.id;
                return (
                  <TableRow key={app.id} className="hover:bg-emerald-50/40">
                    <TableCell className="font-mono text-xs font-bold text-emerald-800">
                      {app.trackingCode}
                    </TableCell>
                    <TableCell>
                      <p className="max-w-44 truncate font-semibold text-stone-800">
                        {app.fullName}
                      </p>
                      <p className="max-w-44 truncate text-xs text-stone-500">{app.email}</p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          TYPE_BADGE[app.applicantType] ?? ""
                        }`}
                      >
                        {app.applicantType}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-40 truncate text-sm">
                      {app.programName || (
                        <span className="font-mono text-xs text-stone-500">{app.programCode}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{app.city}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatDateShort(app.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            meta?.badgeClass ?? "border-stone-200 bg-stone-100 text-stone-600"
                          }`}
                        >
                          {meta?.label ?? app.status}
                        </span>
                        {patching ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-700" aria-hidden />
                        ) : (
                          <Select
                            value={app.status}
                            onValueChange={(v) => handleStatusChange(app, v)}
                          >
                            <SelectTrigger
                              className="h-8 w-36 text-xs"
                              aria-label={`Ubah status ${app.trackingCode}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {APPLICATION_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {APPLICATION_STATUS_META[s]?.label ?? s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        aria-label={`Hapus pengajuan ${app.trackingCode}`}
                        onClick={() => setDeleting(app)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Konfirmasi hapus */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengajuan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Pengajuan{" "}
              <span className="font-mono font-semibold text-stone-800">
                {deleting?.trackingCode}
              </span>{" "}
              atas nama <span className="font-semibold">{deleting?.fullName}</span> akan dihapus
              permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingBusy}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deletingBusy}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              {deletingBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Menghapus…
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
