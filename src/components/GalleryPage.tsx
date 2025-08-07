import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/config/api";
import axios from "axios";

// Type definitions
interface GalleryItem {
  id: number;
  title: string;
  url: string;
  created_at: string;
}

const GalleryPage = () => {
  const [allGallery, setAllGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>(
    {}
  );
  const navigate = useNavigate();

  // Fetch all gallery items from backend
  const fetchAllGallery = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.GALLERY);
      console.log("All gallery data:", res.data);
      setAllGallery(res.data);
      setFilteredGallery(res.data);
    } catch (err) {
      console.error("Error fetching all gallery:", err);
      setAllGallery([]);
      setFilteredGallery([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllGallery();
  }, []);

  // Filter gallery based on search term only
  useEffect(() => {
    let filtered = allGallery;

    // Filter by search term (title only since description and category don't exist)
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGallery(filtered);
  }, [searchTerm, allGallery]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageLoad = (id: number) => {
    setImageLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageClick = (item: GalleryItem) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const downloadImage = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // Get unique categories from data - tidak diperlukan karena tidak ada kolom category
  // const categories = [...new Set(allGallery.map(item => item.category).filter(Boolean))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
            Galeri <span className="text-sago">Colo Sagu</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Dokumentasi perjalanan dan aktivitas gerakan Colo Sagu dalam
            membangun ketahanan pangan berkelanjutan di Papua
          </p>

          {/* Statistics */}
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-2xl font-bold">{allGallery.length}</div>
              <div className="text-white/80">Total Foto</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-2xl font-bold text-blue-300">
                {
                  allGallery.filter(
                    (item) =>
                      new Date(item.created_at).getFullYear() ===
                      new Date().getFullYear()
                  ).length
                }
              </div>
              <div className="text-white/80">Foto Tahun Ini</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
              <div className="text-2xl font-bold text-green-300">
                {
                  allGallery.filter((item) => {
                    const itemDate = new Date(item.created_at);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return itemDate >= thirtyDaysAgo;
                  }).length
                }
              </div>
              <div className="text-white/80">Foto 30 Hari Terakhir</div>
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
              placeholder="Cari foto berdasarkan judul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Menampilkan {filteredGallery.length} dari {allGallery.length} foto
            {searchTerm && <span> untuk pencarian "{searchTerm}"</span>}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading state
            Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-forest/10 to-sago/10 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-forest/50" />
                  </div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredGallery.length > 0 ? (
            // Gallery data
            filteredGallery.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleImageClick(item)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-forest/10 to-sago/10">
                    {imageLoading[item.id] !== false && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-forest/50 animate-pulse" />
                      </div>
                    )}
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onLoad={() => handleImageLoad(item.id)}
                      onError={() => handleImageLoad(item.id)}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 text-black hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(item);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 text-black hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(item.url, item.title);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Featured Badge - tidak diperlukan karena tidak ada kolom is_featured */}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty state
            <div className="col-span-full text-center py-16">
              <Camera className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak ada foto ditemukan
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian"
                  : "Belum ada foto yang tersedia saat ini"}
              </p>
              {searchTerm && (
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Hapus Pencarian
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </Button>

            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            <div className="bg-white rounded-b-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedImage.title}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadImage(selectedImage.url, selectedImage.title)
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{formatDate(selectedImage.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
