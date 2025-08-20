import { Sprout, BookOpen, Users, TreePine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Programs = () => {
  const [programsData, setProgramsData] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const navigate = useNavigate();

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

  // Fetch active programs data (initial load)
  const fetchPrograms = async () => {
    setProgramsLoading(true);
    try {
      const res = await axios.get("/api/programs");
      console.log("Programs data:", res.data);
      setProgramsData(res.data.filter((p: Program) => p.is_active)); // Only active programs
    } catch (err) {
      console.error("Error fetching programs:", err);
      setProgramsData([]);
    }
    setProgramsLoading(false);
  };

  const handleViewAllPrograms = () => {
    navigate("/programs");
  };

  const timeline = [
    {
      year: "2023",
      title: "Peluncuran Gerakan Colo Sagu",
      description:
        "Memulai gerakan edukasi dan sosialisasi budaya pangan sagu di 5 kabupaten Papua",
    },
    {
      year: "2024",
      title: "Ekspansi Program Budidaya",
      description:
        "Mengembangkan program budidaya sagu modern dengan melibatkan 150 petani lokal",
    },
    {
      year: "2025",
      title: "Target Ketahanan Pangan",
      description:
        "Mencapai swasembada sagu di 15 kabupaten dan membentuk 50 komunitas petani",
    },
  ];

  // Determine which data to display
  const displayPrograms = programsData;
  const isLoading = programsLoading;

  return (
    <section id="programs" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Aksi <span className="text-forest">Colo Sagu</span>
          </h2>
          <div className="w-24 h-1 bg-sago mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Program dan inisiatif kami untuk membangun ketahanan pangan
            berkelanjutan di Papua
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {isLoading
            ? // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-pulse"
                >
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
                    <div className="w-32 h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            : displayPrograms.length > 0
            ? // Data programs
              displayPrograms.map((program, index) => {
                const IconComponent = iconMap[program.icon] || Sprout;
                return (
                  <Card
                    key={program.id}
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 flex items-center justify-center">
                      <IconComponent className="w-16 h-16 text-forest group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-block px-3 py-1 bg-forest/10 text-forest text-sm font-medium rounded-full">
                          {program.status}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {program.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            : // Empty state - fallback programs
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 flex items-center justify-center">
                    <Sprout className="w-16 h-16 text-forest/50" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-3 py-1 bg-forest/10 text-forest text-sm font-medium rounded-full">
                        Aktif
                      </span>
                    </div>
                    <CardTitle className="text-xl">
                      Program {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Deskripsi program akan ditampilkan di sini
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* View All Programs Button */}
        <div className="text-center mb-20">
          <Button
            onClick={handleViewAllPrograms}
            className="bg-forest hover:bg-forest/90 text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Lihat Semua Program
          </Button>
        </div>

        {/* Timeline Section */}
        <div className="bg-gradient-to-r from-forest/5 to-sago/5 rounded-3xl p-6 md:p-8 lg:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Timeline <span className="text-forest">Colo Sagu</span>
          </h3>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {timeline.map((item, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <CardContent className="p-6">
                  {/* Icon Circle */}
                  <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-forest/20 transition-colors duration-300">
                    <span className="text-2xl font-bold text-forest">
                      {item.year}
                    </span>
                  </div>

                  {/* Content */}
                  <h4 className="text-lg md:text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
