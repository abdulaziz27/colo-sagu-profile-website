import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroForest from "@/assets/hero-forest.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroForest} 
          alt="Papua Forest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-sago/20 text-white mb-6 animate-fade-in">
            <Leaf className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Gerakan Ketahanan Pangan Papua</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Membangun
            <span className="block text-sago">Ketahanan Pangan</span>
            <span className="block">dari Alam Papua</span>
          </h1>

          {/* Mission Statement */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed animate-fade-in">
            Colo Sagu mengajak masyarakat Papua membudidayakan dan mengonsumsi sagu serta 
            kekuatan budaya pangan lokal untuk menciptakan ketahanan pangan berkelanjutan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-sago hover:bg-sago/80 text-white font-semibold px-8 py-4 text-lg"
            >
              Dukung Misi Kami
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-forest font-semibold px-8 py-4 text-lg"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-pulse">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Gulir ke bawah</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;