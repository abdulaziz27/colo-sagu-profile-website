import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { useRef } from "react";

export default function GalleryTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);
  const [form, setForm] = useState({ title: "", url: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/gallery");
      console.log("Gallery data:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
    setLoading(false);
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      { accessorKey: "title", header: "Judul" },
      {
        accessorKey: "url",
        header: "Gambar",
        cell: (info) => (
          <img src={info.getValue()} alt="gallery" className="h-12 rounded" />
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleEdit(row.original)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleDelete(row.original)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleEdit(row: any) {
    setEditRow(row);
    setForm({ title: row.title, url: row.url });
    setOpen(true);
  }
  function handleDelete(row: any) {
    if (!confirm(`Hapus foto "${row.title}"?`)) return;
    setLoading(true);
    axios
      .delete(`/api/gallery/${row.id}`)
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.error("Error deleting gallery:", err);
        alert("Gagal menghapus foto");
      })
      .finally(() => setLoading(false));
  }
  function handleCreate() {
    setEditRow(null);
    setForm({ title: "", url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setOpen(true);
  }
  function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.title || !form.url) {
      alert("Judul dan gambar harus diisi");
      return;
    }
    setLoading(true);
    const promise = editRow
      ? axios.put(`/api/gallery/${editRow.id}`, form)
      : axios.post("/api/gallery", form);

    promise
      .then(() => {
        console.log("Gallery saved successfully");
        setOpen(false);
        fetchData();
        // Reset form
        setForm({ title: "", url: "" });
        setEditRow(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      })
      .catch((err) => {
        console.error("Error saving gallery:", err);
        alert("Gagal menyimpan foto");
      })
      .finally(() => setLoading(false));
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setLoading(true);
    axios
      .post("/api/gallery/upload", formData)
      .then((res) => {
        console.log("Upload success:", res.data);
        setForm((f) => ({ ...f, url: res.data.url }));
      })
      .catch((err) => {
        console.error("Upload error:", err);
        alert("Gagal upload gambar. Coba lagi.");
      })
      .finally(() => setLoading(false));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Galeri Foto</CardTitle>
        <Button onClick={handleCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Tambah
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 bg-forest text-white"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6">
                    Belum ada foto
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-secondary/30">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            // Reset form when dialog closes
            setForm({ title: "", url: "" });
            setEditRow(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRow ? "Edit Foto" : "Tambah Foto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block mb-1">Judul</label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Gambar</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm"
              />
              {form.url && (
                <img
                  src={form.url}
                  alt="preview"
                  className="h-24 mt-2 rounded border"
                />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Mengupload..." : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
