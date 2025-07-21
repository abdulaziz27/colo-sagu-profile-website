import { Heart, Camera, Youtube, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Donate = () => {
  const donationOptions = [
    {
      amount: "Rp 100.000",
      description: "Mendukung edukasi 1 keluarga tentang budaya pangan sagu",
      impact: "1 Keluarga"
    },
    {
      amount: "Rp 500.000", 
      description: "Membantu pelatihan budidaya sagu untuk 1 petani",
      impact: "1 Petani"
    },
    {
      amount: "Rp 1.000.000",
      description: "Mendukung pembentukan 1 kelompok tani sagu",
      impact: "1 Kelompok"
    }
  ];

  const blogPosts = [
    {
      title: "Manfaat Sagu untuk Ketahanan Pangan Papua",
      excerpt: "Mengapa sagu menjadi harapan ketahanan pangan berkelanjutan di Papua...",
      date: "15 Juli 2024",
      readTime: "5 min"
    },
    {
      title: "Cara Tradisional Mengolah Sagu yang Perlu Dilestarikan",
      excerpt: "Kearifan lokal masyarakat Papua dalam mengolah sagu menjadi makanan bergizi...",
      date: "10 Juli 2024", 
      readTime: "7 min"
    },
    {
      title: "Program Budidaya Sagu: Harapan Ekonomi Masyarakat",
      excerpt: "Bagaimana program budidaya sagu dapat meningkatkan ekonomi lokal...",
      date: "5 Juli 2024",
      readTime: "6 min"
    }
  ];

  return (
    <section id="donate" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Dukung <span className="text-forest">Misi Kami</span>
          </h2>
          <div className="w-24 h-1 bg-sago mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bersama-sama membangun ketahanan pangan Papua yang berkelanjutan
          </p>
        </div>

        {/* Donation Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-forest to-nature rounded-3xl p-8 md:p-12 text-white mb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Berdonasi untuk Papua</h3>
                <p className="text-xl mb-6 opacity-90">
                  Setiap donasi Anda akan langsung membantu masyarakat Papua dalam 
                  membangun ketahanan pangan yang berkelanjutan dan ramah lingkungan.
                </p>
                <Button size="lg" className="bg-sago hover:bg-sago/80 text-white">
                  <Heart className="mr-2 h-5 w-5" />
                  Donasi Sekarang
                </Button>
              </div>
              <div className="grid gap-4">
                {donationOptions.map((option, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-bold text-sago">{option.amount}</span>
                      <span className="text-sm bg-sago/20 px-3 py-1 rounded-full">{option.impact}</span>
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
              {blogPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
                Lihat Semua Artikel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Galeri Colo */}
          <div>
            <div className="flex items-center mb-6">
              <Camera className="w-6 h-6 text-forest mr-3" />
              <h3 className="text-2xl font-bold text-foreground">Galeri Colo</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-8 h-8 text-forest/50" />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
              Lihat Galeri Lengkap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Colo Sagu Channel */}
          <div>
            <div className="flex items-center mb-6">
              <Youtube className="w-6 h-6 text-forest mr-3" />
              <h3 className="text-2xl font-bold text-foreground">Colo Sagu Channel</h3>
            </div>
            <div className="space-y-4 mb-6">
              {[
                "Tutorial Budidaya Sagu Modern",
                "Cara Mengolah Sagu Tradisional",
                "Cerita Petani Sagu Papua"
              ].map((title, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 rounded-lg mb-3 flex items-center justify-center">
                      <Youtube className="w-8 h-8 text-forest" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{title}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
              Kunjungi Channel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;