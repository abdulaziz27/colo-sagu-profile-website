import { Sprout, BookOpen, Users, TreePine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Programs = () => {
  const programs = [
    {
      icon: Sprout,
      title: "Program Budidaya Sagu",
      description: "Membantu masyarakat Papua dalam teknik budidaya sagu yang berkelanjutan dan ramah lingkungan",
      image: "/placeholder.svg?height=200&width=300",
      status: "Aktif",
      participants: "150+ Petani"
    },
    {
      icon: BookOpen,
      title: "Edukasi Pangan Lokal",
      description: "Workshop dan pelatihan tentang nilai gizi dan cara pengolahan pangan lokal Papua",
      image: "/placeholder.svg?height=200&width=300", 
      status: "Berkelanjutan",
      participants: "500+ Peserta"
    },
    {
      icon: Users,
      title: "Pemberdayaan Komunitas",
      description: "Membentuk kelompok tani dan koperasi untuk memperkuat ekonomi masyarakat lokal",
      image: "/placeholder.svg?height=200&width=300",
      status: "Ekspansi",
      participants: "12 Komunitas"
    },
    {
      icon: TreePine,
      title: "Konservasi Hutan Sagu",
      description: "Program pelestarian hutan sagu dan ekosistem alam Papua untuk generasi mendatang",
      image: "/placeholder.svg?height=200&width=300",
      status: "Prioritas",
      participants: "1000+ Hektar"
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Peluncuran Gerakan Colo Sagu",
      description: "Memulai gerakan edukasi dan sosialisasi budaya pangan sagu di 5 kabupaten Papua"
    },
    {
      year: "2024", 
      title: "Ekspansi Program Budidaya",
      description: "Mengembangkan program budidaya sagu modern dengan melibatkan 150 petani lokal"
    },
    {
      year: "2025",
      title: "Target Ketahanan Pangan",
      description: "Mencapai swasembada sagu di 15 kabupaten dan membentuk 50 komunitas petani"
    }
  ];

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
            Program dan inisiatif kami untuk membangun ketahanan pangan berkelanjutan di Papua
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {programs.map((program, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 flex items-center justify-center">
                <program.icon className="w-16 h-16 text-forest group-hover:scale-110 transition-transform duration-300" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-3 py-1 bg-forest/10 text-forest text-sm font-medium rounded-full">
                    {program.status}
                  </span>
                  <span className="text-sm text-muted-foreground">{program.participants}</span>
                </div>
                <CardTitle className="text-xl">{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{program.description}</p>
                <Button variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
                  Pelajari Program
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline Section */}
        <div className="bg-gradient-to-r from-forest/5 to-sago/5 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Timeline <span className="text-forest">Colo Sagu</span>
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-forest/20"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="bg-white shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-forest mb-2">{item.year}</div>
                        <h4 className="text-xl font-semibold text-foreground mb-3">{item.title}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10 w-6 h-6 bg-forest rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;