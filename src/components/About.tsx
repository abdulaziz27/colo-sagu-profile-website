import { Leaf, Users, Globe, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: Leaf,
      title: "Budaya Pangan Lokal",
      description: "Melestarikan dan mengembangkan kearifan budaya pangan Papua yang berkelanjutan"
    },
    {
      icon: Users,
      title: "Pemberdayaan Masyarakat", 
      description: "Mengajak masyarakat Papua untuk membudidayakan sagu dan pangan lokal lainnya"
    },
    {
      icon: Globe,
      title: "Ketahanan Pangan",
      description: "Menciptakan ketahanan pangan lokal dan nasional yang berkelanjutan"
    },
    {
      icon: Heart,
      title: "Kelestarian Lingkungan",
      description: "Memperhatikan keberlangsungan lingkungan hidup dan alam Papua"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Tentang <span className="text-forest">Colo Sagu</span>
          </h2>
          <div className="w-24 h-1 bg-sago mx-auto mb-8"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong className="text-forest">Colo Sagu</strong> secara harfiah terdiri dari dua suku kata yaitu 
                <em className="text-sago"> "colo"</em> dan <em className="text-sago">"sagu"</em>. 
                Kata "Colo" sendiri merupakan kata yang digunakan dalam bahasa sehari-hari di wilayah 
                Indonesia Timur yang memiliki arti sama dengan "celup" atau "mencelupkan".
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Dan <em className="text-sago">"sagu"</em> mengacu atau menunjukan pada pohon sagu secara 
                keseluruhan atau hasil saripati dari pengolahan batang sagu. Dalam kebiasaan sehari-hari 
                masyarakat Papua, Colo Sagu merupakan suatu cara mengonsumsi sagu bakar dengan cara 
                dicelupkan ke dalam minuman panas atau hangat.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong className="text-forest">"Colo Sagu"</strong> kemudian dijadikan brand untuk 
                gerakan mengajak masyarakat Papua membudidayakan dan mengonsumsi sagu. Dan tidak terbatas 
                hanya pada sagu, namun juga semua kekuatan budaya pangan lokal Papua, seperti umbi-umbian 
                dan lain sebagainya yang tumbuh subur di tanah Papua.
              </p>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-gradient-to-br from-forest to-nature p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
              <p className="text-lg leading-relaxed">
                Menciptakan ketahanan pangan secara lokal dan lebih luas ketahanan pangan secara 
                nasional dengan mengacu pada kearifan budaya lokal di Papua dengan memperhatikan 
                keberlangsungan lingkungan hidup atau alam.
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-sago rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-forest" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;