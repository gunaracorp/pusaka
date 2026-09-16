"use client";

// ============================================================
// PUSAKA CMS — CRUD Berita / Artikel
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Loader2, Newspaper, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminNews,
  deleteAdminNews,
  listAdminNews,
  updateAdminNews,
} from "@/lib/admin-api";
import { formatDateShort, type NewsArticleT } from "@/lib/pusaka";
import { toast } from "sonner";

const NEWS_CATEGORIES = ["PENGUMUMAN", "REGULASI", "KEGIATAN", "KEMITRAAN"];

const CATEGORY_BADGE: Record<string, string> = {
  PENGUMUMAN: "bg-emerald-100 text-emerald-800",
  REGULASI: "bg-amber-100 text-amber-800",
  KEGIATAN: "bg-teal-100 text-teal-800",
  KEMITRAAN: "bg-orange-100 text-orange-800",
};

interface NewsForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured: boolean;
  publishedAt: string;
}

const EMPTY_FORM: NewsForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "PENGUMUMAN",
  author: "Sekretariat PUSAKA",
  featured: false,
  publishedAt: "",
};

/** Slug sederhana dari judul. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function AdminNews() {
  const [items, setItems] = useState<NewsArticleT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticleT | null>(null);
  const [deleting, setDeleting] = useState<NewsArticleT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewsForm>(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminNews();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat berita.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(article: NewsArticleT) {
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      featured: article.featured,
      publishedAt: article.publishedAt ? article.publishedAt.slice(0, 10) : "",
    });
    setFormOpen(true);
  }

  function set<K extends keyof NewsForm>(key: K, value: NewsForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error("Judul, ringkasan, dan konten wajib diisi.");
      return;
    }
    setSaving(true);
    const slug = (form.slug.trim() || slugify(form.title.trim())).toLowerCase();
    const payload: Parameters<typeof createAdminNews>[0] = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      author: form.author.trim() || "Sekretariat PUSAKA",
      featured: form.featured,
    };
    if (form.publishedAt) {
      const iso = new Date(`${form.publishedAt}T00:00:00`);
      if (!Number.isNaN(iso.getTime())) payload.publishedAt = iso.toISOString();
    }
    try {
      if (editing) {
        await updateAdminNews(editing.id, payload);
        toast.success("Berita diperbarui", { description: payload.title });
      } else {
        await createAdminNews(payload);
        toast.success("Berita ditambahkan", { description: payload.title });
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan berita.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminNews(deleting.id);
      toast.success("Berita dihapus", { description: deleting.title });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus berita.");
    } finally {
      setDeletingBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
            <Newspaper className="h-5 w-5 text-emerald-700" aria-hidden />
            Berita &amp; Pengumuman
          </h2>
          <p className="text-sm text-stone-500">Kelola artikel yang tampil di situs publik.</p>
        </div>
        <Button
          className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tulis Berita
        </Button>
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
          <Newspaper className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">Belum ada berita. Tulis berita pertama.</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[760px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-center">Unggulan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((article) => (
                <TableRow key={article.id} className="hover:bg-emerald-50/40">
                  <TableCell>
                    <p className="max-w-72 truncate font-semibold text-stone-800">{article.title}</p>
                    <p className="font-mono text-[11px] text-stone-400">{article.slug}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={CATEGORY_BADGE[article.category] ?? ""}>
                      {article.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-stone-600">{article.author}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatDateShort(article.publishedAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    {article.featured ? (
                      <Star className="mx-auto h-4 w-4 fill-amber-400 text-amber-500" aria-label="Unggulan" />
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-700 hover:bg-emerald-100"
                        aria-label={`Edit berita ${article.title}`}
                        onClick={() => openEdit(article)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        aria-label={`Hapus berita ${article.title}`}
                        onClick={() => setDeleting(article)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Berita" : "Tulis Berita"}
            </DialogTitle>
            <DialogDescription>
              {editing ? `Perbarui artikel "${editing.title}".` : "Artikel baru untuk situs publik."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="news-title">Judul *</Label>
              <Input
                id="news-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Judul berita / pengumuman"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="news-slug">Slug</Label>
                <Input
                  id="news-slug"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="otomatis dari judul"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-category">Kategori</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger id="news-category" aria-label="Kategori berita">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-excerpt">Ringkasan *</Label>
              <Textarea
                id="news-excerpt"
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={2}
                placeholder="Ringkasan singkat 1–2 kalimat"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news-content">Konten *</Label>
              <Textarea
                id="news-content"
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                rows={10}
                placeholder="Konten lengkap artikel…"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="news-author">Penulis</Label>
                <Input
                  id="news-author"
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="Sekretariat PUSAKA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-published">Tanggal Terbit (opsional)</Label>
                <Input
                  id="news-published"
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => set("publishedAt", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Switch
                id="news-featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v)}
                aria-label="Berita unggulan"
              />
              <Label htmlFor="news-featured">Berita unggulan</Label>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Menyimpan…
                  </>
                ) : (
                  "Simpan Berita"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi hapus */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus berita ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Artikel <span className="font-semibold text-stone-800">{deleting?.title}</span> akan
              dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
