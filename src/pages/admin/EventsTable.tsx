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
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";

export default function EventsTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/events");
      setData(res.data);
    } catch {}
    setLoading(false);
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      { accessorKey: "name", header: "Nama Event" },
      {
        accessorKey: "start_date",
        header: "Mulai",
        cell: ({ row }) => formatDate(row.getValue("start_date")),
      },
      {
        accessorKey: "end_date",
        header: "Selesai",
        cell: ({ row }) => formatDate(row.getValue("end_date")),
      },
      {
        accessorKey: "is_active",
        header: "Aktif",
        cell: (info) => (info.getValue() ? "Ya" : "Tidak"),
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
    setForm({
      name: row.name,
      start_date: row.start_date,
      end_date: row.end_date,
      is_active: !!row.is_active,
    });
    setOpen(true);
  }
  function handleDelete(row: any) {
    if (!confirm(`Hapus event "${row.name}"?`)) return;
    setLoading(true);

    // Periksa apakah event memiliki donasi terkait
    axios
      .delete(`/api/events/${row.id}`)
      .then(() => {
        fetchData();
        alert("Event berhasil dihapus");
      })
      .catch((err) => {
        console.error("Error deleting event:", err);
        alert(
          "Gagal menghapus event: " + (err.response?.data?.error || err.message)
        );
      })
      .finally(() => setLoading(false));
  }
  function handleCreate() {
    setEditRow(null);
    setForm({ name: "", start_date: "", end_date: "", is_active: true });
    setOpen(true);
  }
  function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.name || !form.start_date || !form.end_date) {
      alert("Nama, tanggal mulai, dan tanggal selesai harus diisi");
      return;
    }
    setLoading(true);
    const payload = { ...form, is_active: !!form.is_active };
    const promise = editRow
      ? axios.put(`/api/events/${editRow.id}`, payload)
      : axios.post("/api/events", payload);
    promise
      .then(() => {
        setOpen(false);
        fetchData();
        setForm({ name: "", start_date: "", end_date: "", is_active: true });
        setEditRow(null);
      })
      .catch((err) => {
        console.error("Error saving event:", err);
        alert("Gagal menyimpan event");
      })
      .finally(() => setLoading(false));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daftar Event Donasi</CardTitle>
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
                    Belum ada event
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRow ? "Edit Event" : "Tambah Event"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block mb-1">Nama Event</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Tanggal Mulai</label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, start_date: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Tanggal Selesai</label>
              <Input
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, end_date: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Aktif</label>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_active: e.target.checked }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
