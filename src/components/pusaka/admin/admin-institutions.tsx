"use client";

// ============================================================
// PUSAKA CMS — CRUD Institusi (PPIU/PIHK/BPW/IATA)
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Building2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
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
import {
  createAdminInstitution,
  deleteAdminInstitution,
  listAdminInstitutions,
  updateAdminInstitution,
} from "@/lib/admin-api";
import {
  getPrograms,
  STATUS_META,
  TIER_META,
  TYPE_META,
  type InstitutionT,
  type ProgramT,
} from "@/lib/pusaka";
import { toast } from "sonner";

const TYPES = ["PPIU", "PIHK", "BPW", "IATA"];
const TIERS = ["SILVER", "GOLD", "PLATINUM"];
const STATUSES = ["AKTIF", "DIPERBARUI", "KADALUARSA"];

interface InstitutionForm {
  name: string;
  certNumber: string;
  type: string;
  programCode: string;
  tier: string;
  status: string;
  city: string;
  province: string;
  score: string;
  issuedAt: string;
  expiresAt: string;
  contact: string;
  phone: string;
}

const EMPTY_FORM: InstitutionForm = {
  name: "",
  certNumber: "",
  type: "PPIU",
  programCode: "",
  tier: "SILVER",
  status: "AKTIF",
  city: "",
  province: "",
  score: "80",
  issuedAt: "",
  expiresAt: "",
  contact: "",
  phone: "",
};

/** ISO string → "yyyy-MM-dd" untuk input type="date". */
function isoToInputDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/** "yyyy-MM-dd" → ISO string. */
function inputDateToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function AdminInstitutions() {
  const [items, setItems] = useState<InstitutionT[] | null>(null);
  const [programs, setPrograms] = useState<ProgramT[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InstitutionT | null>(null);
  const [deleting, setDeleting] = useState<InstitutionT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<InstitutionForm>(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, progs] = await Promise.all([
        listAdminInstitutions(),
        getPrograms().catch(() => [] as ProgramT[]),
      ]);
      setItems(data);
      setPrograms(progs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat institusi.");
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

  function openEdit(inst: InstitutionT) {
    setEditing(inst);
    setForm({
      name: inst.name,
      certNumber: inst.certNumber,
      type: inst.type,
      programCode: inst.programCode,
      tier: inst.tier,
      status: inst.status,
      city: inst.city,
      province: inst.province,
      score: String(inst.score),
      issuedAt: isoToInputDate(inst.issuedAt),
      expiresAt: isoToInputDate(inst.expiresAt),
      contact: inst.contact ?? "",
      phone: inst.phone ?? "",
    });
    setFormOpen(true);
  }

  function set<K extends keyof InstitutionForm>(key: K, value: InstitutionForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const issuedIso = inputDateToIso(form.issuedAt);
    const expiresIso = inputDateToIso(form.expiresAt);
    if (!form.name.trim() || !form.certNumber.trim() || !form.programCode) {
      toast.error("Nama, nomor sertifikat, dan program wajib diisi.");
      return;
    }
    if (!issuedIso || !expiresIso) {
      toast.error("Tanggal terbit dan berlaku hingga wajib diisi.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      certNumber: form.certNumber.trim().toUpperCase(),
      type: form.type,
      programCode: form.programCode,
      tier: form.tier,
      status: form.status,
      city: form.city.trim(),
      province: form.province.trim(),
      score: Math.max(0, Math.min(100, Number(form.score) || 0)),
      issuedAt: issuedIso,
      expiresAt: expiresIso,
      contact: form.contact.trim() || undefined,
      phone: form.phone.trim() || undefined,
    };
    try {
      if (editing) {
        await updateAdminInstitution(editing.id, payload);
        toast.success("Institusi diperbarui", { description: payload.name });
      } else {
        await createAdminInstitution(payload);
        toast.success("Institusi ditambahkan", { description: payload.name });
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan institusi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminInstitution(deleting.id);
      toast.success("Institusi dihapus", { description: deleting.name });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus institusi.");
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
            <Building2 className="h-5 w-5 text-emerald-700" aria-hidden />
            Institusi Terakreditasi
          </h2>
          <p className="text-sm text-stone-500">
            Kelola data lembaga pemegang sertifikat &amp; akreditasi.
          </p>
        </div>
        <Button
          className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah Institusi
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
          <Building2 className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">Belum ada institusi. Tambahkan institusi pertama.</p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[980px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead>No. Sertifikat</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="w-32">Skor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((inst) => (
                <TableRow key={inst.id} className="hover:bg-emerald-50/40">
                  <TableCell className="font-mono text-xs font-bold text-emerald-800">
                    {inst.certNumber}
                  </TableCell>
                  <TableCell>
                    <p className="max-w-56 truncate font-semibold text-stone-800">{inst.name}</p>
                    <p className="text-xs text-stone-500">{inst.province || "—"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={TYPE_META[inst.type]?.badgeClass ?? ""}>{inst.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{inst.city}</TableCell>
                  <TableCell>
                    <Badge className={TIER_META[inst.tier]?.badgeClass ?? ""}>
                      {TIER_META[inst.tier]?.label ?? inst.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={inst.score}
                        aria-label={`Skor audit ${inst.name}: ${inst.score}`}
                        className="h-2"
                      />
                      <span className="w-7 shrink-0 text-right font-mono text-xs text-stone-600">
                        {inst.score}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_META[inst.status]?.badgeClass ?? ""}>
                      {STATUS_META[inst.status]?.label ?? inst.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-700 hover:bg-emerald-100"
                        aria-label={`Edit institusi ${inst.name}`}
                        onClick={() => openEdit(inst)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        aria-label={`Hapus institusi ${inst.name}`}
                        onClick={() => setDeleting(inst)}
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
              {editing ? "Edit Institusi" : "Tambah Institusi"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? `Perbarui data ${editing.name}.`
                : "Isi data institusi pemegang sertifikat baru."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="inst-name">Nama Institusi *</Label>
              <Input
                id="inst-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="cth. PT Zahra Tour Indonesia"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inst-cert">No. Sertifikat *</Label>
                <Input
                  id="inst-cert"
                  value={form.certNumber}
                  onChange={(e) => set("certNumber", e.target.value.toUpperCase())}
                  placeholder="cth. PPU-2026-0101"
                  className="font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inst-type">Jenis *</Label>
                <Select value={form.type} onValueChange={(v) => set("type", v)}>
                  <SelectTrigger id="inst-type" aria-label="Jenis institusi">
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t} — {TYPE_META[t]?.desc ?? ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inst-program">Program *</Label>
                <Select value={form.programCode} onValueChange={(v) => set("programCode", v)}>
                  <SelectTrigger id="inst-program" aria-label="Program institusi">
                    <SelectValue placeholder="Pilih program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.code}>
                        {p.code} — {p.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inst-tier">Tier</Label>
                <Select value={form.tier} onValueChange={(v) => set("tier", v)}>
                  <SelectTrigger id="inst-tier" aria-label="Tier institusi">
                    <SelectValue placeholder="Pilih tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inst-status">Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger id="inst-status" aria-label="Status institusi">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_META[s]?.label ?? s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inst-score">Skor Audit (0–100)</Label>
                <Input
                  id="inst-score"
                  type="number"
                  min={0}
                  max={100}
                  value={form.score}
                  onChange={(e) => set("score", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inst-city">Kota *</Label>
                <Input
                  id="inst-city"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="cth. Jakarta Selatan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inst-prov">Provinsi *</Label>
                <Input
                  id="inst-prov"
                  value={form.province}
                  onChange={(e) => set("province", e.target.value)}
                  placeholder="cth. DKI Jakarta"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inst-issued">Terbit *</Label>
                <Input
                  id="inst-issued"
                  type="date"
                  value={form.issuedAt}
                  onChange={(e) => set("issuedAt", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inst-expires">Berlaku Hingga *</Label>
                <Input
                  id="inst-expires"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => set("expiresAt", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inst-contact">Kontak</Label>
                <Input
                  id="inst-contact"
                  value={form.contact}
                  onChange={(e) => set("contact", e.target.value)}
                  placeholder="Nama penanggung jawab"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inst-phone">Telepon</Label>
                <Input
                  id="inst-phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="cth. +62 21 555 0123"
                />
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
                  "Simpan Institusi"
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
            <AlertDialogTitle>Hapus institusi ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Institusi <span className="font-semibold text-stone-800">{deleting?.name}</span> (
              <span className="font-mono">{deleting?.certNumber}</span>) akan dihapus permanen.
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
