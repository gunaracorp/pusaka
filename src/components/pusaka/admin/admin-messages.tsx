"use client";

// ============================================================
// PUSAKA CMS — Pesan kontak: daftar, tandai dibaca, hapus
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, MailOpen, RefreshCw, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteAdminMessage,
  listAdminMessages,
  updateAdminMessage,
  type AdminMessageT,
} from "@/lib/admin-api";
import { formatDateTime } from "@/lib/pusaka";
import { toast } from "sonner";

export function AdminMessages() {
  const [items, setItems] = useState<AdminMessageT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminMessageT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await listAdminMessages();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat pesan.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(msg: AdminMessageT) {
    setTogglingId(msg.id);
    try {
      const updated = await updateAdminMessage(msg.id, !msg.handled);
      setItems((prev) =>
        prev ? prev.map((m) => (m.id === msg.id ? { ...m, handled: updated.handled } : m)) : prev,
      );
      toast.success(updated.handled ? "Ditandai sudah dibaca" : "Ditandai belum dibaca", {
        description: `Pesan dari ${msg.name}`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui pesan.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminMessage(deleting.id);
      toast.success("Pesan dihapus", { description: `Subjek: ${deleting.subject}` });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus pesan.");
    } finally {
      setDeletingBusy(false);
    }
  }

  const unreadCount = items?.filter((m) => !m.handled).length ?? 0;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
            <Mail className="h-5 w-5 text-emerald-700" aria-hidden />
            Pesan Masuk
            {unreadCount > 0 ? (
              <Badge className="border-rose-200 bg-rose-100 text-rose-700">
                {unreadCount} Belum Dibaca
              </Badge>
            ) : null}
          </h2>
          <p className="text-sm text-stone-500">Pesan dari formulir kontak situs publik.</p>
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

      {/* Daftar pesan */}
      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <Mail className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">Belum ada pesan masuk.</p>
        </div>
      ) : (
        <ul className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {items.map((msg) => {
            const toggling = togglingId === msg.id;
            return (
              <li
                key={msg.id}
                className={`rounded-xl border bg-card p-4 shadow-sm transition-colors ${
                  msg.handled ? "" : "border-emerald-300/70 bg-emerald-50/40"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-stone-800">{msg.name}</p>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-emerald-700 underline-offset-2 hover:underline"
                      >
                        {msg.email}
                      </a>
                      {!msg.handled ? (
                        <Badge className="border-amber-200 bg-amber-100 text-amber-800">
                          Belum dibaca
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 font-bold text-stone-900">{msg.subject}</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                      {msg.message}
                    </p>
                    <p className="mt-2 text-[11px] text-stone-400">
                      {formatDateTime(msg.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1 sm:flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-emerald-700 hover:bg-emerald-100"
                      aria-label={
                        msg.handled
                          ? `Tandai belum dibaca: ${msg.subject}`
                          : `Tandai sudah dibaca: ${msg.subject}`
                      }
                      disabled={toggling}
                      onClick={() => handleToggle(msg)}
                    >
                      {toggling ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : msg.handled ? (
                        <MailOpen className="h-4 w-4" aria-hidden />
                      ) : (
                        <Mail className="h-4 w-4" aria-hidden />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-600 hover:bg-red-50"
                      aria-label={`Hapus pesan: ${msg.subject}`}
                      onClick={() => setDeleting(msg)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Konfirmasi hapus */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pesan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Pesan dari <span className="font-semibold text-stone-800">{deleting?.name}</span> dengan
              subjek <span className="font-semibold">“{deleting?.subject}”</span> akan dihapus
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
