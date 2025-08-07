import {
  Sprout,
  BookOpen,
  Users,
  TreePine,
  ArrowLeft,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // atau import { useRouter } from "next/router"; untuk Next.js
import axios from "axios";

// Type definitions
interface Program {
  id: number;
  title: string;
  description: string;
  status: string;
  icon: string;
  is_active: boolean;
}

const AllProgramsPage = () => {
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate(); // untuk React Router, atau const router = useRouter(); untuk Next.js

  // Icon mapping dengan proper typing
  const iconMap: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    Sprout,
    BookOpen,
    Users,
    TreePine,
    Leaf: Sprout, // fallback
    Heart: Users, // fallback
    Globe: TreePine, // fallback
    Target: BookOpen, // fallback
  };

  // Fetch all programs from backend
  const fetchAllPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/programs");
      console.log("All programs data:", res.data);
      setAllPrograms(res.data);
      setFilteredPrograms(res.data);
    } catch (err) {
      console.error("Error fetching all programs:", err);
      setAllPrograms([]);
      setFilteredPrograms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPrograms();
  }, []);

  // Filter programs based on search and status
  useEffect(() => {
    let filtered = allPrograms;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (program) =>
          program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          program.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter((program) => program.is_active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((program) => !program.is_active);
    }

    setFilteredPrograms(filtered);
  }, [searchTerm, statusFilter, allPrograms]);

  const handleBack = () => {
    navigate(-1); // kembali ke halaman sebelumnya
    // router.back(); // untuk Next.js
  };

  const activeCount = allPrograms.filter((p) => p.is_active).length;
  const inactiveCount = allPrograms.filter((p) => !p.is_active).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest to-forest/80 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Semua Program <span className="text-sago">Colo Sagu</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Jelajahi seluruh program dan inisiatif kami untuk membangun
            ketahanan pangan berkelanjutan di Papua
          </p>

          {/* Statistics */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-2xl font-bold">{allPrograms.length}</div>
              <div className="text-white/80">Total Program</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-2xl font-bold text-green-300">
                {activeCount}
              </div>
              <div className="text-white/80">Program Aktif</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-2xl font-bold text-orange-300">
                {inactiveCount}
              </div>
              <div className="text-white/80">Program Tidak Aktif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari program berdasarkan nama, deskripsi, atau status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Program Aktif</SelectItem>
                <SelectItem value="inactive">Program Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Menampilkan {filteredPrograms.length} dari {allPrograms.length}{" "}
            program
            {searchTerm && <span> untuk pencarian "{searchTerm}"</span>}
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading state
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredPrograms.length > 0 ? (
            // Programs data
            filteredPrograms.map((program) => {
              const IconComponent = iconMap[program.icon] || Sprout;
              return (
                <Card
                  key={program.id}
                  className={`overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    !program.is_active ? "opacity-70" : ""
                  }`}
                  onClick={() => {
                    // Handle program detail navigation
                    // navigate(`/programs/${program.id}`);
                    console.log("Navigating to program:", program.id);
                  }}
                >
                  <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 flex items-center justify-center">
                    <IconComponent className="w-16 h-16 text-forest group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          program.is_active
                            ? "bg-forest/10 text-forest"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {program.status}
                      </span>
                      {!program.is_active && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          Tidak Aktif
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-forest transition-colors">
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {program.description}
                    </p>
                    <div className="mt-4 text-sm text-forest font-medium">
                      Klik untuk detail →
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // Empty state
            <div className="col-span-full text-center py-16">
              <Sprout className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak ada program ditemukan
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Coba ubah kata kunci pencarian atau filter status"
                  : "Belum ada program yang tersedia saat ini"}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Hapus Pencarian
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStatusFilter("all")}
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProgramsPage;
