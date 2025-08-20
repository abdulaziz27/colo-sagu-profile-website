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

export default function UsersTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);
  const [form, setForm] = useState({ email: "", name: "", password: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users");
      console.log("Users data:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      { accessorKey: "email", header: "Email" },
      { accessorKey: "name", header: "Nama" },
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
    setForm({ email: row.email, name: row.name, password: "" });
    setOpen(true);
  }
  function handleDelete(row: any) {
    if (!confirm(`Hapus user "${row.email}"?`)) return;
    setLoading(true);
    axios
      .delete(`/api/users/${row.id}`)
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        alert("Gagal menghapus user");
      })
      .finally(() => setLoading(false));
  }
  function handleCreate() {
    setEditRow(null);
    setForm({ email: "", name: "", password: "" });
    setOpen(true);
  }
  function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.email || !form.name) {
      alert("Email dan nama harus diisi");
      return;
    }
    if (!editRow && !form.password) {
      alert("Password harus diisi untuk user baru");
      return;
    }
    setLoading(true);
    const payload =
      editRow && !form.password
        ? { email: form.email, name: form.name }
        : { email: form.email, name: form.name, password: form.password };

    const promise = editRow
      ? axios.put(`/api/users/${editRow.id}`, payload)
      : axios.post("/api/users", payload);

    promise
      .then(() => {
        console.log("User saved successfully");
        setOpen(false);
        fetchData();
        setForm({ email: "", name: "", password: "" });
        setEditRow(null);
      })
      .catch((err) => {
        console.error("Error saving user:", err);
        alert("Gagal menyimpan user");
      })
      .finally(() => setLoading(false));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daftar Users</CardTitle>
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
                    Belum ada user
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
            setForm({ email: "", name: "", password: "" });
            setEditRow(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editRow ? "Edit User" : "Tambah User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block mb-1">Email</label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                type="email"
              />
            </div>
            <div>
              <label className="block mb-1">Nama</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <Input
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                type="password"
                required={!editRow}
                placeholder={
                  editRow
                    ? "Kosongkan jika tidak ingin mengubah password"
                    : "Password"
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
