"use client";

// ============================================================
// PUSAKA CMS — CRUD Program Sertifikasi
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Award, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
  createAdminProgram,
  deleteAdminProgram,
  listAdminPrograms,
  updateAdminProgram,
} from "@/lib/admin-api";
import { CATEGORY_LABEL, formatIDR, formatNumber, safeParseJsonArray, type ProgramT } from "@/lib/pusaka";
import { toast } from "sonner";

const CATEGORY_BADGE: Record<string, string> = {
  PERUSAHAAN: "bg-emerald-100 text-emerald-800 border-emerald-200",
  PROFESI: "bg-amber-100 text-amber-800 border-amber-200",
  IZIN: "bg-teal-100 text-teal-800 border-teal-200",
};

const ACCENT_COLORS = ["emerald", "amber", "teal", "rose", "cyan", "lime", "orange"];

interface ProgramForm {
  code: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  description: string;
  requirements: string;
  benefits: string;
  accreditation: string;
  durationDays: string;
  price: string;
  seatsLeft: string;
  holderCount: string;
  passRate: string;
  accentColor: string;
  featured: boolean;
}

const EMPTY_FORM: ProgramForm = {
  code: "",
  name: "",
  shortName: "",
  category: "PERUSAHAAN",
  tagline: "",
  description: "",
  requirements: "",
  benefits: "",
  accreditation: "",
  durationDays: "3",
  price: "0",
  seatsLeft: "0",
  holderCount: "0",
  passRate: "80",
  accentColor: "emerald",
  featured: false,
};

function toLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function AdminPrograms() {
  const [items, setItems] = useState<ProgramT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramT | null>(null);
  const [deleting, setDeleting] = useState<ProgramT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProgramForm>(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminPrograms();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat program.");
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

  function openEdit(program: ProgramT) {
    setEditing(program);
    setForm({
      code: program.code,
      name: program.name,
      shortName: program.shortName,
      category: program.category,
      tagline: program.tagline,
      description: program.description,
      requirements: safeParseJsonArray(program.requirements).join("\n"),
      benefits: safeParseJsonArray(program.benefits).join("\n"),
      accreditation: safeParseJsonArray(program.accreditation).join("\n"),
      durationDays: String(program.durationDays),
      price: String(program.price),
      seatsLeft: String(program.seatsLeft),
      holderCount: String(program.holderCount),
      passRate: String(program.passRate),
      accentColor: program.accentColor || "emerald",
      featured: program.featured,
    });
    setFormOpen(true);
  }

  function set<K extends keyof ProgramForm>(key: K, value: ProgramForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim() || !form.shortName.trim()) {
      toast.error("Kode, nama, dan nama singkat program wajib diisi.");
      return;
    }
    setSaving(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      category: form.category,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      requirements: toLines(form.requirements),
      benefits: toLines(form.benefits),
      accreditation: toLines(form.accreditation),
      durationDays: Number(form.durationDays) || 0,
      price: Number(form.price) || 0,
      seatsLeft: Number(form.seatsLeft) || 0,
      holderCount: Number(form.holderCount) || 0,
      passRate: Number(form.passRate) || 0,
      accentColor: form.accentColor,
      featured: form.featured,
    };
    try {
      if (editing) {
        await updateAdminProgram(editing.id, payload);
        toast.success("Program diperbarui", { description: payload.name });
      } else {
        await createAdminProgram(payload);
        toast.success("Program ditambahkan", { description: payload.name });
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan program.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminProgram(deleting.id);
      toast.success("Program dihapus", { description: deleting.name });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus program.");
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
            <Award className="h-5 w-5 text-emerald-700" aria-hidden />
            Program Sertifikasi
          </h2>
          <p className="text-sm text-stone-500">
            Kelola program PIHK, PPIU, BPW, IATA, dan izin resmi.
          </p>
        </div>
        <Button
          className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah Program
        </Button>
      </div>

      {/* Tabel */}
      {loading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <Award className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">Belum ada program. Tambahkan program pertama.</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[860px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Pemegang</TableHead>
                <TableHead className="text-center">Unggulan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id} className="hover:bg-emerald-50/40">
                  <TableCell className="font-mono text-xs font-bold text-emerald-800">{p.code}</TableCell>
                  <TableCell>
                    <p className="font-semibold text-stone-800">{p.name}</p>
                    <p className="text-xs text-stone-500">{p.shortName}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={CATEGORY_BADGE[p.category] ?? ""}>
                      {CATEGORY_LABEL[p.category] ?? p.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatIDR(p.price)}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatNumber(p.holderCount)}</TableCell>
                  <TableCell className="text-center">
                    {p.featured ? (
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
                        aria-label={`Edit program ${p.name}`}
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        aria-label={`Hapus program ${p.name}`}
                        onClick={() => setDeleting(p)}
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
              {editing ? "Edit Program" : "Tambah Program"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? `Perbarui data program ${editing.name}.`
                : "Isi data program sertifikasi baru."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prog-code">Kode *</Label>
                <Input
                  id="prog-code"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="cth. PPIU"
                  className="font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prog-category">Kategori *</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger id="prog-category" aria-label="Kategori program">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERUSAHAAN">Perusahaan</SelectItem>
                    <SelectItem value="PROFESI">Profesi</SelectItem>
                    <SelectItem value="IZIN">Izin Resmi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prog-name">Nama Program *</Label>
              <Input
                id="prog-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="cth. Akreditasi Penyelenggara Umrah"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prog-short">Nama Singkat *</Label>
                <Input
                  id="prog-short"
                  value={form.shortName}
                  onChange={(e) => set("shortName", e.target.value)}
                  placeholder="cth. Akreditasi PPIU"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prog-accent">Warna Aksen</Label>
                <Select value={form.accentColor} onValueChange={(v) => set("accentColor", v)}>
                  <SelectTrigger id="prog-accent" aria-label="Warna aksen">
                    <SelectValue placeholder="Pilih warna" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCENT_COLORS.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prog-tagline">Tagline</Label>
              <Input
                id="prog-tagline"
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="Tagline singkat program"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prog-desc">Deskripsi</Label>
              <Textarea
                id="prog-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Deskripsi lengkap program"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prog-req">Persyaratan (satu per baris)</Label>
                <Textarea
                  id="prog-req"
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                  rows={4}
                  placeholder={"Badan hukum resmi\nMinimal 3 tahun beroperasi"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prog-benefit">Manfaat (satu per baris)</Label>
                <Textarea
                  id="prog-benefit"
                  value={form.benefits}
                  onChange={(e) => set("benefits", e.target.value)}
                  rows={4}
                  placeholder={"Sertifikat digital QR\nPrioritas pendampingan"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prog-accred">Akreditasi / Mitra (satu per baris)</Label>
              <Textarea
                id="prog-accred"
                value={form.accreditation}
                onChange={(e) => set("accreditation", e.target.value)}
                rows={3}
                placeholder={"BNSP\nKemenag RI"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="prog-duration">Durasi (hari)</Label>
                <Input
                  id="prog-duration"
                  type="number"
                  min={0}
                  value={form.durationDays}
                  onChange={(e) => set("durationDays", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prog-price">Harga (Rp)</Label>
                <Input
                  id="prog-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prog-seats">Sisa Kuota</Label>
                <Input
                  id="prog-seats"
                  type="number"
                  min={0}
                  value={form.seatsLeft}
                  onChange={(e) => set("seatsLeft", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prog-holders">Pemegang Sertifikat</Label>
                <Input
                  id="prog-holders"
                  type="number"
                  min={0}
                  value={form.holderCount}
                  onChange={(e) => set("holderCount", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prog-pass">Tingkat Kelulusan (%)</Label>
                <Input
                  id="prog-pass"
                  type="number"
                  min={0}
                  max={100}
                  value={form.passRate}
                  onChange={(e) => set("passRate", e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Switch
                  id="prog-featured"
                  checked={form.featured}
                  onCheckedChange={(v) => set("featured", v)}
                  aria-label="Program unggulan"
                />
                <Label htmlFor="prog-featured">Program unggulan</Label>
              </div>
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
                  "Simpan Program"
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
            <AlertDialogTitle>Hapus program ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Program <span className="font-semibold text-stone-800">{deleting?.name}</span> (
              <span className="font-mono">{deleting?.code}</span>) akan dihapus permanen. Tindakan
              ini tidak dapat dibatalkan.
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
