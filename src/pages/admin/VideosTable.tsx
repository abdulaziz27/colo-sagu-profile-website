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
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Video {
  id: number;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  is_featured: boolean;
  created_at: string;
}

export default function VideosTable() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    thumbnail_url: "",
    is_featured: false,
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/videos");
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Gagal mengambil data video");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        await axios.put(`/api/videos/${editingVideo.id}`, formData);
        toast.success("Video berhasil diperbarui");
      } else {
        await axios.post("/api/videos", formData);
        toast.success("Video berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      setEditingVideo(null);
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Gagal menyimpan video");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus video ini?")) return;
    try {
      await axios.delete(`/api/videos/${id}`);
      toast.success("Video berhasil dihapus");
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Gagal menghapus video");
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      youtube_url: video.youtube_url,
      thumbnail_url: video.thumbnail_url || "",
      is_featured: video.is_featured,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtube_url: "",
      thumbnail_url: "",
      is_featured: false,
    });
  };

  const openDialog = () => {
    setEditingVideo(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<Video>[] = [
    {
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.getValue("title")}</p>
        </div>
      ),
    },
    {
      accessorKey: "youtube_url",
      header: "Link YouTube",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <a
            href={row.getValue("youtube_url")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <span className="text-xs text-gray-500 truncate max-w-32">
            {row.getValue("youtube_url")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "is_featured",
      header: "Featured",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue("is_featured")
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.getValue("is_featured") ? "Ya" : "Tidak"}
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
    data: videos,
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
        <h2 className="text-2xl font-bold">Manajemen Video Channel</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? "Edit Video" : "Tambah Video Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Judul Video *</Label>
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
                  <Label htmlFor="youtube_url">URL YouTube *</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) =>
                      setFormData({ ...formData, youtube_url: e.target.value })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="thumbnail_url">URL Thumbnail</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail_url: e.target.value })
                  }
                  placeholder="https://img.youtube.com/vi/..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label htmlFor="is_featured">Video Unggulan</Label>
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
                  {editingVideo ? "Update" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-forest ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
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
                  Tidak ada data video
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
