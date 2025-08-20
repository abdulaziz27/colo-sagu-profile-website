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
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { Editor } from "@/components/blocks/editor-00/editor";
import { SerializedEditorState } from "lexical";
import axios from "axios";
import { toast } from "sonner";
import "@/components/editor/shadcn-editor.css";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  is_published: boolean;
  created_at: string;
}

const initialEditorValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function BlogPostsTable() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Colo Sagu Team",
    is_published: true,
  });
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialEditorValue);

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/blog-posts");
      setBlogPosts(response.data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Gagal mengambil data blog posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert editor state to HTML string for storage
      const contentHtml = JSON.stringify(editorState);
      const submitData = { ...formData, content: contentHtml };

      if (editingPost) {
        await axios.put(`/api/blog-posts/${editingPost.id}`, submitData);
        toast.success("Blog post berhasil diperbarui");
      } else {
        await axios.post("/api/blog-posts", submitData);
        toast.success("Blog post berhasil ditambahkan");
      }
      setIsDialogOpen(false);
      setEditingPost(null);
      resetForm();
      fetchBlogPosts();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast.error("Gagal menyimpan blog post");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus blog post ini?")) return;
    try {
      await axios.delete(`/api/blog-posts/${id}`);
      toast.success("Blog post berhasil dihapus");
      fetchBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast.error("Gagal menghapus blog post");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      author: post.author,
      is_published: post.is_published,
    });

    // Parse content back to editor state
    try {
      const parsedContent = JSON.parse(post.content || "{}");
      setEditorState(parsedContent);
    } catch {
      setEditorState(initialEditorValue);
    }

    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "Colo Sagu Team",
      is_published: true,
    });
    setEditorState(initialEditorValue);
  };

  const openDialog = () => {
    setEditingPost(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<BlogPost>[] = [
    {
      accessorKey: "title",
      header: "Judul Artikel",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.getValue("title")}</p>
        </div>
      ),
    },
    {
      accessorKey: "excerpt",
      header: "Excerpt",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {row.getValue("excerpt")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Penulis",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("author")}</span>
      ),
    },
    {
      accessorKey: "is_published",
      header: "Dipublikasi",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue("is_published")
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.getValue("is_published") ? "Ya" : "Tidak"}
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
    data: blogPosts,
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
        <h2 className="text-2xl font-bold">Manajemen Blog Colo</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Artikel
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-4xl max-h-[90vh] overflow-y-auto"
            style={{ zIndex: 50 }}
          >
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Artikel" : "Tambah Artikel Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Artikel *</Label>
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
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={3}
                  placeholder="Ringkasan singkat artikel..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Konten Artikel</Label>
                <div className="mt-2">
                  <div className="lexical-editor">
                    <Editor
                      editorSerializedState={editorState}
                      onSerializedChange={(value) => {
                        setEditorState(value);
                        setFormData({
                          ...formData,
                          content: JSON.stringify(value),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Colo Sagu Team"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_published: checked })
                  }
                />
                <Label htmlFor="is_published">Publikasikan Artikel</Label>
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
                  {editingPost ? "Update" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-forest">
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
                  Tidak ada data artikel
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
