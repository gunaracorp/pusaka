"use client";

// ============================================================
// PUSAKA CMS — CRUD Jaringan Global (kantor & mitra internasional)
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { Globe2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  createAdminGlobalNode,
  deleteAdminGlobalNode,
  listAdminGlobalNodes,
  updateAdminGlobalNode,
} from "@/lib/admin-api";
import {
  GLOBAL_KIND_LABEL,
  GLOBAL_REGION_LABEL,
  GLOBAL_REGION_ORDER,
  GLOBAL_STATUS_META,
  PROGRAM_LABELS,
  safeParseJsonArray,
  type GlobalNodeT,
} from "@/lib/pusaka";
import { toast } from "sonner";

const KIND_BADGE: Record<string, string> = {
  KANTOR_PERWAKILAN: "bg-emerald-100 text-emerald-800 border-emerald-200",
  MITRA_INTERNASIONAL: "bg-amber-100 text-amber-800 border-amber-200",
};

const PROGRAM_CODES = Object.keys(PROGRAM_LABELS);

interface GlobalNodeForm {
  kind: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  flag: string;
  title: string;
  orgName: string;
  description: string;
  scope: string[];
  status: string;
  since: string;
  contact: string;
  order: string;
}

const EMPTY_FORM: GlobalNodeForm = {
  kind: "KANTOR_PERWAKILAN",
  country: "",
  countryCode: "",
  region: "TIMUR_TENGAH",
  city: "",
  flag: "",
  title: "",
  orgName: "",
  description: "",
  scope: [],
  status: "AKTIF",
  since: "2026",
  contact: "",
  order: "10",
};

export function AdminGlobalNodes() {
  const [items, setItems] = useState<GlobalNodeT[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GlobalNodeT | null>(null);
  const [deleting, setDeleting] = useState<GlobalNodeT | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<GlobalNodeForm>(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminGlobalNodes();
      setItems(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat jaringan global.");
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

  function openEdit(node: GlobalNodeT) {
    setEditing(node);
    setForm({
      kind: node.kind,
      country: node.country,
      countryCode: node.countryCode,
      region: node.region,
      city: node.city,
      flag: node.flag,
      title: node.title,
      orgName: node.orgName,
      description: node.description,
      scope: safeParseJsonArray(node.scope),
      status: node.status,
      since: node.since,
      contact: node.contact ?? "",
      order: String(node.order),
    });
    setFormOpen(true);
  }

  function set<K extends keyof GlobalNodeForm>(key: K, value: GlobalNodeForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleScope(code: string, checked: boolean) {
    setForm((f) => ({
      ...f,
      scope: checked ? [...f.scope, code] : f.scope.filter((c) => c !== code),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.country.trim().length < 2) {
      toast.error("Nama negara minimal 2 karakter.");
      return;
    }
    if (!/^[A-Za-z]{2}$/.test(form.countryCode.trim())) {
      toast.error("Kode negara harus tepat 2 huruf (ISO-2, contoh: SA).");
      return;
    }
    if (!form.flag.trim()) {
      toast.error("Emoji bendera wajib diisi.");
      return;
    }
    if (form.city.trim().length < 2) {
      toast.error("Kota minimal 2 karakter.");
      return;
    }
    if (form.title.trim().length < 2) {
      toast.error("Judul minimal 2 karakter.");
      return;
    }
    if (form.orgName.trim().length < 2) {
      toast.error("Nama organisasi minimal 2 karakter.");
      return;
    }
    if (form.description.trim().length < 2) {
      toast.error("Deskripsi minimal 2 karakter.");
      return;
    }
    if (!/^(19|20)\d{2}$/.test(form.since.trim())) {
      toast.error("Tahun harus 4 digit (contoh: 2018).");
      return;
    }
    if (Number(form.order) < 0) {
      toast.error("Urutan tampil minimal 0.");
      return;
    }
    setSaving(true);
    const payload = {
      kind: form.kind,
      country: form.country.trim(),
      countryCode: form.countryCode.trim().toUpperCase(),
      region: form.region,
      city: form.city.trim(),
      flag: form.flag.trim(),
      title: form.title.trim(),
      orgName: form.orgName.trim(),
      description: form.description.trim(),
      scope: form.scope,
      status: form.status,
      since: form.since.trim(),
      contact: form.contact.trim() ? form.contact.trim() : null,
      order: Number(form.order) || 0,
    };
    try {
      if (editing) {
        await updateAdminGlobalNode(editing.id, payload);
        toast.success("Node jaringan diperbarui", { description: `${payload.country} — ${payload.city}` });
      } else {
        await createAdminGlobalNode(payload);
        toast.success("Node jaringan ditambahkan", { description: `${payload.country} — ${payload.city}` });
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan node jaringan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await deleteAdminGlobalNode(deleting.id);
      toast.success("Node jaringan dihapus", { description: `${deleting.country} — ${deleting.city}` });
      setDeleting(null);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus node jaringan.");
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
            <Globe2 className="h-5 w-5 text-emerald-700" aria-hidden />
            Jaringan Global
          </h2>
          <p className="text-sm text-stone-500">
            Kelola kantor perwakilan &amp; mitra internasional PUSAKA di 32 negara.
          </p>
        </div>
        <Button
          className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tambah Node
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
          <Globe2 className="h-10 w-10 text-stone-300" aria-hidden />
          <p className="text-sm text-stone-500">
            Belum ada node jaringan. Tambahkan kantor atau mitra pertama.
          </p>
        </div>
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-lg border">
          <Table className="min-w-[900px]">
            <TableHeader className="sticky top-0 z-10 bg-stone-50">
              <TableRow>
                <TableHead className="w-14">Negara</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Judul / Organisasi</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Scope</TableHead>
                <TableHead className="text-right">Urutan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((n) => {
                const statusMeta = GLOBAL_STATUS_META[n.status];
                const scopeCount = safeParseJsonArray(n.scope).length;
                return (
                  <TableRow key={n.id} className="hover:bg-emerald-50/40">
                    <TableCell>
                      <span className="text-2xl leading-none" aria-hidden>
                        {n.flag}
                      </span>
                      <span className="sr-only">{n.country}</span>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-stone-800">{n.country}</p>
                      <p className="text-xs text-stone-500">
                        {n.city} • {GLOBAL_REGION_LABEL[n.region] ?? n.region}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-56">
                      <p className="truncate font-medium text-stone-800">{n.title}</p>
                      <p className="truncate text-xs text-stone-500">{n.orgName}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={KIND_BADGE[n.kind] ?? ""}>
                        {GLOBAL_KIND_LABEL[n.kind] ?? n.kind}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {statusMeta ? (
                        <Badge variant="outline" className={statusMeta.badgeClass}>
                          {statusMeta.label}
                        </Badge>
                      ) : (
                        <span className="text-xs text-stone-400">{n.status}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-800"
                        title={safeParseJsonArray(n.scope).join(", ")}
                      >
                        {scopeCount} program
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">{n.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-700 hover:bg-emerald-100"
                          aria-label={`Edit node ${n.country} — ${n.city}`}
                          onClick={() => openEdit(n)}
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          aria-label={`Hapus node ${n.country} — ${n.city}`}
                          onClick={() => setDeleting(n)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? "Edit Node Jaringan" : "Tambah Node Jaringan"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? `Perbarui data node ${editing.country} — ${editing.city}.`
                : "Isi data kantor perwakilan atau mitra internasional baru."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gn-kind">Jenis Node *</Label>
                <Select value={form.kind} onValueChange={(v) => set("kind", v)}>
                  <SelectTrigger id="gn-kind" aria-label="Jenis node">
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KANTOR_PERWAKILAN">Kantor Perwakilan</SelectItem>
                    <SelectItem value="MITRA_INTERNASIONAL">Mitra Internasional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gn-status">Status *</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger id="gn-status" aria-label="Status node">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AKTIF">Aktif Beroperasi</SelectItem>
                    <SelectItem value="MOU">MoU Ditandatangani</SelectItem>
                    <SelectItem value="APLIKASI">Dalam Proses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="gn-country">Negara *</Label>
                <Input
                  id="gn-country"
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  placeholder="cth. Arab Saudi"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gn-cc">Kode Negara (ISO-2) *</Label>
                <Input
                  id="gn-cc"
                  value={form.countryCode}
                  onChange={(e) => set("countryCode", e.target.value.toUpperCase())}
                  maxLength={2}
                  placeholder="SA"
                  className="font-mono uppercase"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gn-flag">Bendera (emoji) *</Label>
                <Input
                  id="gn-flag"
                  value={form.flag}
                  onChange={(e) => set("flag", e.target.value)}
                  placeholder="🇸🇦"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gn-region">Kawasan *</Label>
                <Select value={form.region} onValueChange={(v) => set("region", v)}>
                  <SelectTrigger id="gn-region" aria-label="Kawasan">
                    <SelectValue placeholder="Pilih kawasan" />
                  </SelectTrigger>
                  <SelectContent>
                    {GLOBAL_REGION_ORDER.map((r) => (
                      <SelectItem key={r} value={r}>
                        {GLOBAL_REGION_LABEL[r] ?? r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gn-city">Kota *</Label>
                <Input
                  id="gn-city"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="cth. Riyadh"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gn-title">Judul / Jabatan *</Label>
              <Input
                id="gn-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="cth. Direktur Regional Timur Tengah"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gn-org">Nama Organisasi *</Label>
              <Input
                id="gn-org"
                value={form.orgName}
                onChange={(e) => set("orgName", e.target.value)}
                placeholder="cth. PUSAKA Representative Office Riyadh"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gn-desc">Deskripsi *</Label>
              <Textarea
                id="gn-desc"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Deskripsi peran & layanan node ini (min. 2 karakter)"
                required
              />
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Cakupan Program (Scope)</legend>
              <div className="grid grid-cols-1 gap-2 rounded-lg border p-3 sm:grid-cols-2">
                {PROGRAM_CODES.map((code) => {
                  const checked = form.scope.includes(code);
                  const checkboxId = `gn-scope-${code}`;
                  return (
                    <div key={code} className="flex items-center gap-2">
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        onCheckedChange={(v) => toggleScope(code, v === true)}
                      />
                      <Label
                        htmlFor={checkboxId}
                        className="cursor-pointer text-sm font-normal text-stone-700"
                      >
                        {PROGRAM_LABELS[code] ?? code}
                        <span className="ml-1 font-mono text-[10px] text-stone-400">{code}</span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="gn-since">Beroperasi Sejak (tahun) *</Label>
                <Input
                  id="gn-since"
                  value={form.since}
                  onChange={(e) => set("since", e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                  placeholder="2026"
                  inputMode="numeric"
                  maxLength={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gn-contact">Kontak (email)</Label>
                <Input
                  id="gn-contact"
                  type="email"
                  value={form.contact}
                  onChange={(e) => set("contact", e.target.value)}
                  placeholder="kosongkan bila tidak ada"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gn-order">Urutan Tampil</Label>
                <Input
                  id="gn-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => set("order", e.target.value)}
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
                  "Simpan Node"
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
            <AlertDialogTitle>Hapus node jaringan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Node{" "}
              <span className="font-semibold text-stone-800">
                {deleting?.flag} {deleting?.country}
              </span>{" "}
              — {deleting?.city} ({deleting?.orgName}) akan dihapus permanen. Tindakan ini tidak
              dapat dibatalkan.
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
