import { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Program {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: string;
  is_active: boolean;
  created_at: string;
}

const iconOptions = [
  { value: "Sprout", label: "Sprout (Tunas)" },
  { value: "BookOpen", label: "BookOpen (Buku)" },
  { value: "Users", label: "Users (Pengguna)" },
  { value: "TreePine", label: "TreePine (Pohon)" },
  { value: "Leaf", label: "Leaf (Daun)" },
  { value: "Heart", label: "Heart (Hati)" },
  { value: "Globe", label: "Globe (Dunia)" },
  { value: "Target", label: "Target (Sasaran)" },
];

const statusOptions = [
  { value: "Aktif", label: "Aktif" },
  { value: "Berkelanjutan", label: "Berkelanjutan" },
  { value: "Ekspansi", label: "Ekspansi" },
  { value: "Prioritas", label: "Prioritas" },
  { value: "Pengembangan", label: "Pengembangan" },
];

export default function ProgramsTable() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    status: "Aktif",
    is_active: true,
  });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/programs");
      setPrograms(response.data);
    } catch (error) {
      console.error("Error fetching programs:", error);
      toast.error("Gagal mengambil data program");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await axios.put(`/api/programs/${editingProgram.id}`, formData);
        toast.success("Program berhasil diperbarui");
      } else {
        await axios.post("/api/programs", formData);
        toast.success("Program berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      setEditingProgram(null);
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error("Error saving program:", error);
      toast.error("Gagal menyimpan program");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus program ini?")) return;
    try {
      await axios.delete(`/api/programs/${id}`);
      toast.success("Program berhasil dihapus");
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Gagal menghapus program");
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      icon: program.icon,
      status: program.status,
      is_active: program.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "",
      status: "Aktif",
      is_active: true,
    });
  };

  const openDialog = () => {
    setEditingProgram(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Program>[] = [
    {
      accessorKey: "title",
      header: "Judul Program",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.getValue("title")}</p>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {row.getValue("description")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => (
        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
          {row.getValue("icon")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue("status") === "Aktif"
              ? "bg-green-100 text-green-800"
              : row.getValue("status") === "Berkelanjutan"
              ? "bg-blue-100 text-blue-800"
              : row.getValue("status") === "Ekspansi"
              ? "bg-orange-100 text-orange-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {row.getValue("status")}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Aktif",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue("is_active")
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.getValue("is_active") ? "Ya" : "Tidak"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Dibuat",
      cell: ({ row }) => (
        <span className="text-sm">
          {new Date(row.getValue("created_at")).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: programs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Aksi Colo Sagu</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? "Edit Program" : "Tambah Program Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Program *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon *</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Program Aktif</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit">
                  {editingProgram ? "Update" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data program
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
