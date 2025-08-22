import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan import ini
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { API_ENDPOINTS, MIDTRANS_CONFIG } from "@/config/api";
import axios from "axios";
import { toast } from "sonner";
import {
  Eye,
  Play,
  Calendar,
  User,
  ArrowRight,
  Heart,
  Camera,
  Youtube,
  BookOpen,
} from "lucide-react";

// Type definitions
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  created_at: string;
  is_published: boolean;
}

interface GalleryItem {
  id: number;
  title: string;
  url: string;
}

interface Video {
  id: number;
  title: string;
  youtube_url: string;
  thumbnail_url?: string;
  is_featured: boolean;
}

interface ActiveEvent {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

const Donate = () => {
  const navigate = useNavigate(); // Tambahkan ini

  const donationOptions = [
    {
      amount: 100000,
      description: "Mendukung edukasi 1 keluarga tentang budaya pangan sagu",
      impact: "1 Keluarga",
    },
    {
      amount: 500000,
      description: "Membantu pelatihan budidaya sagu untuk 1 petani",
      impact: "1 Petani",
    },
    {
      amount: 1000000,
      description: "Mendukung pembentukan 1 kelompok tani sagu",
      impact: "1 Kelompok",
    },
  ];

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalDonation, setTotalDonation] = useState(0);
  const donateButtonRef = useRef<HTMLButtonElement>(null);
  const [isSnapOpen, setIsSnapOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [videosData, setVideosData] = useState<Video[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

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

  // Fungsi untuk fetch total donasi
  const fetchTotal = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.TOTAL_DONATIONS);
      setTotalDonation(res.data.total);
    } catch (error) {
      // Handle error silently
      console.error("Error fetching total donations:", error);
    }
  };

  // Fungsi untuk fetch data galeri
  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.GALLERY);
      console.log("Gallery data:", res.data);
      setGalleryData(res.data.slice(0, 4)); // Ambil 4 foto terbaru
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setGalleryData([]); // Set empty array jika error
    }
    setGalleryLoading(false);
  };

  // Fungsi untuk fetch data videos
  const fetchVideos = async () => {
    setVideosLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.VIDEOS);
      console.log("Videos data:", res.data);
      setVideosData(res.data.filter((v: Video) => v.is_featured).slice(0, 3)); // Ambil 3 video featured
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideosData([]); // Set empty array jika error
    }
    setVideosLoading(false);
  };

  // Fungsi untuk fetch data blog posts
  const fetchBlog = async () => {
    setBlogLoading(true);
    try {
      const res = await axios.get(API_ENDPOINTS.BLOG_POSTS);
      console.log("Blog data:", res.data);
      setBlogData(res.data.filter((b: BlogPost) => b.is_published).slice(0, 3)); // Ambil 3 blog published
    } catch (err) {
      console.error("Error fetching blog:", err);
      setBlogData([]); // Set empty array jika error
    }
    setBlogLoading(false);
  };

  // Fungsi untuk navigasi ke halaman galeri lengkap
  const handleViewFullGallery = () => {
    navigate("/gallery"); // Navigasi ke halaman galeri lengkap
  };

  useEffect(() => {
    // Ambil event aktif
    const fetchEvent = async () => {
      setEventLoading(true);
      try {
        const res = await axios.get(API_ENDPOINTS.ACTIVE_EVENT);
        setActiveEvent(res.data);
      } catch (error) {
        console.error("Error fetching active event:", error);
        setActiveEvent(null);
      }
      setEventLoading(false);
    };
    fetchEvent();
    fetchTotal();
    fetchGallery(); // Tambahkan fetch gallery
    fetchVideos(); // Tambahkan fetch videos
    fetchBlog(); // Tambahkan fetch blog
    const interval = setInterval(fetchTotal, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateTransactionStatus = async (orderId: string, status: string) => {
    try {
      console.log(`Updating transaction ${orderId} to status: ${status}`);
      const response = await axios.post(
        `${API_ENDPOINTS.DONATE}/../check-transaction`,
        {
          order_id: orderId,
          manual_status: status,
        }
      );

      console.log("Transaction status update result:", response.data);

      if (status === "settlement") {
        toast.success("Donasi berhasil!");
      } else if (status === "failed") {
        toast.error("Pembayaran gagal");
      }

      fetchTotal(); // update total donasi
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  };

  const handleDonate = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isSnapOpen) return; // Cegah Snap dipanggil dua kali
    setLoading(true);
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount < 10000) {
      toast.error("Minimal donasi Rp 10.000");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(API_ENDPOINTS.DONATE, { name, amount });
      const { snapToken, orderId } = res.data;
      console.log("Snap token didapat:", snapToken);
      console.log("Order ID:", orderId);

      // @ts-expect-error - Midtrans snap is loaded externally
      if (!window.snap) {
        toast.error("Midtrans Snap belum ter-load. Coba refresh halaman.");
        setLoading(false);
        return;
      }
      donateButtonRef.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
      setIsSnapOpen(true);

      // @ts-expect-error - Midtrans snap is loaded externally
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log("Payment success:", result);
          setIsSnapOpen(false);
          setSuccessMsg("Terima kasih, donasi Anda berhasil!");
          donateButtonRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Update status to settlement and refresh total
          updateTransactionStatus(orderId, "settlement");
          fetchTotal();
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
          setIsSnapOpen(false);
          setSuccessMsg("Donasi Anda sedang diproses. Terima kasih!");
          donateButtonRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          // Keep as pending, will be updated by callback
          fetchTotal();
        },
        onError: function (result) {
          console.log("Payment error:", result);
          setIsSnapOpen(false);
          // Update status to failed
          updateTransactionStatus(orderId, "failed");
          toast.error("Pembayaran gagal");
        },
        onClose: function () {
          console.log("Snap closed by user");
          setIsSnapOpen(false);
          donateButtonRef.current?.focus();
          // Status remains pending when user closes without completing payment
        },
      });
    } catch (err) {
      setIsSnapOpen(false);
      console.error("Error axios:", err);
      toast.error("Gagal memproses donasi");
    }
    setLoading(false);
  };

  if (eventLoading)
    return <div className="text-center py-20">Memuat event donasi...</div>;

  // Hilangkan pesan besar merah, tetap render UI donasi
  const isEventActive = !!activeEvent;

  return (
    <section
      id="donate"
      className="py-20 bg-gradient-to-b from-background to-secondary/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Dukung <span className="text-forest">Misi Kami</span>
          </h2>
          <div className="w-24 h-1 bg-sago mx-auto mb-8"></div>
          <div className="text-lg font-semibold text-forest mb-2">
            Event: {activeEvent?.name || "Tidak ada event"} (
            {formatDate(activeEvent?.start_date || "")} s/d{" "}
            {formatDate(activeEvent?.end_date || "")})
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bersama-sama membangun ketahanan pangan Papua yang berkelanjutan
          </p>
          <div className="mt-4 text-lg font-semibold text-forest">
            Total Donasi Terkumpul: Rp{" "}
            {(Number(totalDonation) || 0).toLocaleString("id-ID")}
          </div>
          {successMsg && (
            <div className="mt-4 text-green-700 font-bold bg-green-100 rounded p-2 max-w-lg mx-auto">
              {successMsg}
            </div>
          )}
        </div>

        {/* Donation Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-forest to-nature rounded-3xl p-8 md:p-12 text-white mb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">
                  Berdonasi untuk Papua
                </h3>
                <p className="text-xl mb-6 opacity-90">
                  Setiap donasi Anda akan langsung membantu masyarakat Papua
                  dalam membangun ketahanan pangan yang berkelanjutan dan ramah
                  lingkungan.
                </p>
                <div className="mb-4">
                  <label className="block mb-2">Nama (opsional)</label>
                  <input
                    type="text"
                    className="rounded px-3 py-2 text-black w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Pilih Nominal Donasi</label>
                  <div className="flex gap-2 mb-2">
                    {donationOptions.map((option, idx) => (
                      <button
                        key={idx}
                        className={`px-4 py-2 rounded font-bold border ${
                          selectedAmount === option.amount
                            ? "bg-sago text-white"
                            : "bg-white/20 text-white border-white/30"
                        }`}
                        onClick={() => {
                          setSelectedAmount(option.amount);
                          setCustomAmount("");
                        }}
                        type="button"
                      >
                        Rp {option.amount.toLocaleString("id-ID")}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="10000"
                    className="rounded px-3 py-2 text-black w-full"
                    placeholder="Nominal custom (minimal Rp 10.000)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                </div>
                <button
                  ref={donateButtonRef}
                  className="bg-sago hover:bg-sago/80 text-white px-6 py-3 rounded font-bold mt-2"
                  onClick={handleDonate}
                  disabled={loading || !isEventActive}
                  type="button"
                >
                  {loading ? (
                    "Memproses..."
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5 inline" /> Donasi Sekarang
                    </>
                  )}
                </button>
                {!isEventActive && (
                  <div className="text-sm text-red-600 mt-2">
                    Donasi sedang tidak tersedia. Silakan cek kembali nanti.
                  </div>
                )}
              </div>
              <div className="grid gap-4">
                {donationOptions.map((option, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-bold text-sago">
                        Rp {option.amount.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm bg-sago/20 px-3 py-1 rounded-full">
                        {option.impact}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog Colo */}
          <div>
            <div className="flex items-center mb-6">
              <BookOpen className="w-6 h-6 text-forest mr-3" />
              <h3 className="text-2xl font-bold text-foreground">Blog Colo</h3>
            </div>
            <div className="space-y-6">
              {blogLoading
                ? // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 animate-pulse"
                    >
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <div className="w-16 h-3 bg-gray-200 rounded"></div>
                          <div className="w-12 h-3 bg-gray-200 rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : blogData.length > 0
                ? // Data blog posts
                  blogData.map((post, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/artikel/${post.id || index}`)
                      }
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            {new Date(post.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : // Empty state
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/artikel/${index + 1}`)
                      }
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                          Artikel {index + 1}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          Deskripsi artikel akan ditampilkan di sini
                        </p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Tanggal</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              <Button
                variant="outline"
                className="w-full border-forest text-forest hover:bg-forest hover:text-white"
                onClick={() => (window.location.href = "/blog")}
              >
                Lihat Semua Artikel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Galeri Colo */}
          <div>
            <div className="flex items-center mb-6">
              <Camera className="w-6 h-6 text-forest mr-3" />
              <h3 className="text-2xl font-bold text-foreground">
                Galeri Colo
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {galleryLoading
                ? // Loading state
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg overflow-hidden animate-pulse"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-forest/50" />
                      </div>
                    </div>
                  ))
                : galleryData.length > 0
                ? // Data galeri
                  galleryData.map((item, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg overflow-hidden group cursor-pointer relative"
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Overlay dengan judul */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                        <div className="p-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-xs font-medium truncate">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                : // Empty state
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg overflow-hidden"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-forest/50" />
                      </div>
                    </div>
                  ))}
            </div>
            <Button
              variant="outline"
              className="w-full border-forest text-forest hover:bg-forest hover:text-white"
              onClick={handleViewFullGallery}
            >
              Lihat Galeri Lengkap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Colo Sagu Channel */}
          <div>
            <div className="flex items-center mb-6">
              <Youtube className="w-6 h-6 text-forest mr-3" />
              <h3 className="text-2xl font-bold text-foreground">
                Colo Sagu Channel
              </h3>
            </div>
            <div className="space-y-4 mb-6">
              {videosLoading
                ? // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 animate-pulse"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg mb-3 flex items-center justify-center">
                          <Youtube className="w-8 h-8 text-forest/50" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))
                : videosData.length > 0
                ? // Data videos
                  videosData.map((video, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => window.open(video.youtube_url, "_blank")}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                          {video.thumbnail_url ? (
                            <img
                              src={video.thumbnail_url}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Youtube className="w-8 h-8 text-forest" />
                          )}
                          {/* Play button overlay */}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                              <Youtube className="w-6 h-6 text-forest" />
                            </div>
                          </div>
                        </div>
                        <h4 className="font-semibold text-foreground text-sm line-clamp-2">
                          {video.title}
                        </h4>
                      </CardContent>
                    </Card>
                  ))
                : // Empty state
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg mb-3 flex items-center justify-center">
                          <Youtube className="w-8 h-8 text-forest" />
                        </div>
                        <h4 className="font-semibold text-foreground text-sm">
                          Video {index + 1}
                        </h4>
                      </CardContent>
                    </Card>
                  ))}
            </div>
            <Button
              variant="outline"
              className="w-full border-forest text-forest hover:bg-forest hover:text-white"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/@colosaguofficial",
                  "_blank"
                )
              }
            >
              Kelola Video Channel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
