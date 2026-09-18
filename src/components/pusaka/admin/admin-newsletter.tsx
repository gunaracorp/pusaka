"use client";

// ============================================================
// PUSAKA CMS — Newsletter: daftar pelanggan, toggle aktif, hapus
// ============================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, MailPlus, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteAdminNewsletter,
  listAdminNewsletter,
  toggleAdminNewsletter,
  type NewsletterT,
} from "@/lib/admin-api";
import { formatDateTime, timeAgo } from "@/lib/pusaka";

export function AdminNewsletter() {
  const [items, setItems] = useState<NewsletterT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<NewsletterT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await listAdminNewsletter();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat pelanggan newsletter.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!items) return [];
    if (!q) return items;
    return items.filter((s) => s.email.toLowerCase().includes(q));
  }, [items, query]);

  async function handleToggle(sub: NewsletterT) {
    setTogglingId(sub.id);
    try {
      const updated = await toggleAdminNewsletter(sub.id, !sub.isActive);
      setItems((prev) =>
        prev
          ? prev.map((s) => (s.id === sub.id ? { ...s, isActive: updated.isActive } : s))
          : prev,
      );
      toast.success(updated.isActive ? "Pelanggan diaktifkan" : "Pelanggan dinonaktifkan", {
        description: sub.email,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui status pelanggan.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminNewsletter(deleting.id);
      toast.success("Pelanggan dihapus", { description: deleting.email });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus pelanggan.");
    } finally {
      setDeletingBusy(false);
    }
  }

  const activeCount = items?.filter((s) => s.isActive).length ?? 0;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="flex flex-wrap items-center gap-2 font-display text-xl font-bold text-stone-900">
            <MailPlus className="h-5 w-5 text-emerald-700" aria-hidden />
            Newsletter
            {items ? (
              <>
                <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
                  {items.length} Pelanggan
                </Badge>
                <Badge className="border-amber-200 bg-amber-100 text-amber-800">
                  {activeCount} Aktif
                </Badge>
              </>
            ) : null}
          </h2>
          <p className="text-sm text-stone-500">
            Pelanggan newsletter dari formulir footer situs publik.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari email…"
              aria-label="Cari email pelanggan"
              className="pl-9"
            />
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
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <MailPlus className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">Belum ada pelanggan newsletter.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <Search className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">
            Tidak ada email yang cocok dengan “{query.trim()}”.
          </p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[640px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead className="text-center">Aktif</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => {
                const toggling = togglingId === sub.id;
                return (
                  <TableRow key={sub.id} className="hover:bg-emerald-50/40">
                    <TableCell className="font-mono text-sm font-medium text-stone-800">
                      {sub.email}
                    </TableCell>
                    <TableCell>
                      {sub.isActive ? (
                        <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge className="border-stone-200 bg-stone-100 text-stone-600">
                          Nonaktif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatDateTime(sub.createdAt)}
                      <span className="block text-[11px] text-stone-400">
                        {timeAgo(sub.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {toggling ? (
                        <Loader2
                          className="mx-auto h-4 w-4 animate-spin text-emerald-700"
                          aria-hidden
                        />
                      ) : (
                        <Switch
                          checked={sub.isActive}
                          onCheckedChange={() => void handleToggle(sub)}
                          aria-label={`Aktifkan/nonaktifkan ${sub.email}`}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        aria-label={`Hapus pelanggan ${sub.email}`}
                        onClick={() => setDeleting(sub)}
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
            <AlertDialogTitle>Hapus pelanggan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Email <span className="font-semibold text-stone-800">{deleting?.email}</span> akan
              dihapus permanen dari daftar newsletter. Tindakan ini tidak dapat dibatalkan.
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
