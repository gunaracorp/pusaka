"use client";

// ============================================================
// PUSAKA CMS — CRUD Dewan Pakar
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Star, Trash2, Users } from "lucide-react";
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
  createAdminExpert,
  deleteAdminExpert,
  listAdminExperts,
  updateAdminExpert,
} from "@/lib/admin-api";
import { formatNumber, type ExpertT } from "@/lib/pusaka";
import { toast } from "sonner";

const EXPERT_CATEGORIES = [
  { value: "HUKUM", label: "Hukum" },
  { value: "IBADAH", label: "Ibadah" },
  { value: "AVIASI", label: "Aviasi" },
  { value: "MANAJEMEN", label: "Manajemen" },
  { value: "KEUANGAN", label: "Keuangan" },
  { value: "TEKNOLOGI", label: "Teknologi" },
  { value: "KESEHATAN", label: "Kesehatan" },
  { value: "BAHASA", label: "Bahasa" },
  { value: "LOGISTIK", label: "Logistik" },
];

const CATEGORY_BADGE: Record<string, string> = {
  HUKUM: "bg-stone-100 text-stone-700 border-stone-200",
  IBADAH: "bg-emerald-100 text-emerald-800 border-emerald-200",
  AVIASI: "bg-cyan-100 text-cyan-800 border-cyan-200",
  MANAJEMEN: "bg-amber-100 text-amber-800 border-amber-200",
  KEUANGAN: "bg-teal-100 text-teal-800 border-teal-200",
  TEKNOLOGI: "bg-orange-100 text-orange-800 border-orange-200",
  KESEHATAN: "bg-rose-100 text-rose-700 border-rose-200",
  BAHASA: "bg-lime-100 text-lime-800 border-lime-200",
  LOGISTIK: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

interface ExpertForm {
  name: string;
  field: string;
  expertise: string;
  category: string;
  licenseNo: string;
  experienceYears: string;
  organization: string;
  education: string;
  initials: string;
  featured: boolean;
}

const EMPTY_FORM: ExpertForm = {
  name: "",
  field: "",
  expertise: "",
  category: "IBADAH",
  licenseNo: "",
  experienceYears: "10",
  organization: "",
  education: "",
  initials: "",
  featured: false,
};

export function AdminExperts() {
  const [items, setItems] = useState<ExpertT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ExpertT | null>(null);
  const [deleting, setDeleting] = useState<ExpertT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ExpertForm>(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminExperts();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat dewan pakar.");
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

  function openEdit(expert: ExpertT) {
    setEditing(expert);
    setForm({
      name: expert.name,
      field: expert.field,
      expertise: expert.expertise,
      category: expert.category,
      licenseNo: expert.licenseNo,
      experienceYears: String(expert.experienceYears),
      organization: expert.organization,
      education: expert.education,
      initials: expert.initials,
      featured: expert.featured,
    });
    setFormOpen(true);
  }

  function set<K extends keyof ExpertForm>(key: K, value: ExpertForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.category || !form.licenseNo.trim()) {
      toast.error("Nama, kategori, dan nomor lisensi wajib diisi.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      field: form.field.trim(),
      expertise: form.expertise.trim(),
      category: form.category,
      licenseNo: form.licenseNo.trim().toUpperCase(),
      experienceYears: Number(form.experienceYears) || 0,
      organization: form.organization.trim(),
      education: form.education.trim(),
      initials:
        form.initials.trim().toUpperCase() ||
        form.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w.charAt(0).toUpperCase())
          .join(""),
      featured: form.featured,
    };
    try {
      if (editing) {
        await updateAdminExpert(editing.id, payload);
        toast.success("Pakar diperbarui", { description: payload.name });
      } else {
        await createAdminExpert(payload);
        toast.success("Pakar ditambahkan", { description: payload.name });
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan data pakar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminExpert(deleting.id);
      toast.success("Pakar dihapus", { description: deleting.name });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus pakar.");
    } finally {
      setDeletingBusy(false);
    }
  }

  const count = items?.length ?? 0;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
            <Users className="h-5 w-5 text-emerald-700" aria-hidden />
            Dewan Pakar
            <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
              {formatNumber(count)} Pakar
            </Badge>
          </h2>
          <p className="text-sm text-stone-500">
            Kelola 9 bidang keilmuan: hukum, ibadah, aviasi, hingga logistik.
          </p>
        </div>
        <Button
          className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah Pakar
        </Button>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <Users className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">Belum ada pakar. Tambahkan pakar pertama.</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[820px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead className="w-14"> </TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Bidang</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Lisensi</TableHead>
                <TableHead className="text-right">Pengalaman</TableHead>
                <TableHead className="text-center">Unggulan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((exp) => (
                <TableRow key={exp.id} className="hover:bg-emerald-50/40">
                  <TableCell>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-teal-600 text-xs font-bold text-white"
                      aria-hidden
                    >
                      {exp.initials}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-stone-800">{exp.name}</p>
                    <p className="max-w-52 truncate text-xs text-stone-500">{exp.organization}</p>
                  </TableCell>
                  <TableCell className="text-sm">{exp.field}</TableCell>
                  <TableCell>
                    <Badge className={CATEGORY_BADGE[exp.category] ?? ""}>{exp.category}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{exp.licenseNo}</TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {exp.experienceYears} thn
                  </TableCell>
                  <TableCell className="text-center">
                    {exp.featured ? (
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
                        aria-label={`Edit pakar ${exp.name}`}
                        onClick={() => openEdit(exp)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        aria-label={`Hapus pakar ${exp.name}`}
                        onClick={() => setDeleting(exp)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Pakar" : "Tambah Pakar"}
            </DialogTitle>
            <DialogDescription>
              {editing ? `Perbarui profil ${editing.name}.` : "Isi profil dewan pakar baru."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exp-name">Nama Lengkap *</Label>
                <Input
                  id="exp-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="cth. Dr. H. Ahmad Fulan, Lc., M.A."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-initials">Inisial</Label>
                <Input
                  id="exp-initials"
                  value={form.initials}
                  onChange={(e) => set("initials", e.target.value.toUpperCase())}
                  placeholder="Otomatis dari nama bila kosong"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exp-field">Bidang</Label>
                <Input
                  id="exp-field"
                  value={form.field}
                  onChange={(e) => set("field", e.target.value)}
                  placeholder="cth. Hukum Perjalanan Ibadah"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-category">Kategori *</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger id="exp-category" aria-label="Kategori keilmuan">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-expertise">Keahlian</Label>
              <Textarea
                id="exp-expertise"
                value={form.expertise}
                onChange={(e) => set("expertise", e.target.value)}
                rows={3}
                placeholder="Ringkasan keahlian & pengalaman"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="exp-license">No. Lisensi *</Label>
                <Input
                  id="exp-license"
                  value={form.licenseNo}
                  onChange={(e) => set("licenseNo", e.target.value.toUpperCase())}
                  placeholder="cth. PSK-HUK-011"
                  className="font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-years">Pengalaman (tahun)</Label>
                <Input
                  id="exp-years"
                  type="number"
                  min={0}
                  value={form.experienceYears}
                  onChange={(e) => set("experienceYears", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-org">Organisasi / Institusi</Label>
              <Input
                id="exp-org"
                value={form.organization}
                onChange={(e) => set("organization", e.target.value)}
                placeholder="cth. Universitas Islam Negeri"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp-edu">Pendidikan</Label>
              <Input
                id="exp-edu"
                value={form.education}
                onChange={(e) => set("education", e.target.value)}
                placeholder="cth. S3 Hukum Islam, UIN Syarif Hidayatullah"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Switch
                id="exp-featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v)}
                aria-label="Pakar unggulan"
              />
              <Label htmlFor="exp-featured">Pakar unggulan</Label>
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
                  "Simpan Pakar"
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
            <AlertDialogTitle>Hapus pakar ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Pakar <span className="font-semibold text-stone-800">{deleting?.name}</span> (
              <span className="font-mono">{deleting?.licenseNo}</span>) akan dihapus permanen.
              Tindakan ini tidak dapat dibatalkan.
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
