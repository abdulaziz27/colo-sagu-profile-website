import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Lokasi",
      details: "Jayapura, Papua, Indonesia",
      subtitle: "Kantor Pusat Colo Sagu Nusantara"
    },
    {
      icon: Phone,
      title: "Telepon",
      details: "+62 967 123 4567",
      subtitle: "Senin - Jumat, 08:00 - 17:00 WIT"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@colosagu.org",
      subtitle: "Respon dalam 24 jam"
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      details: "08:00 - 17:00 WIT",
      subtitle: "Senin sampai Jumat"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Hubungi <span className="text-forest">Kami</span>
          </h2>
          <div className="w-24 h-1 bg-sago mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mari bergabung dalam misi membangun ketahanan pangan Papua yang berkelanjutan
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">Informasi Kontak</h3>
            
            <div className="grid gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-forest" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                        <p className="text-lg text-forest font-medium mb-1">{info.details}</p>
                        <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-forest/10 to-sago/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-forest mx-auto mb-2" />
                  <p className="text-muted-foreground">Peta Lokasi Colo Sagu</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Kirim Pesan Anda</CardTitle>
                <p className="text-muted-foreground">
                  Kami siap mendengar ide, saran, atau pertanyaan Anda tentang misi Colo Sagu
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nama Depan</Label>
                    <Input id="firstName" placeholder="Masukkan nama depan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nama Belakang</Label>
                    <Input id="lastName" placeholder="Masukkan nama belakang" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="nama@email.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" type="tel" placeholder="+62 xxx xxxx xxxx" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subjek</Label>
                  <Input id="subject" placeholder="Topik pesan Anda" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tulis pesan Anda di sini..." 
                    className="min-h-[120px]"
                  />
                </div>

                <Button className="w-full bg-forest hover:bg-forest-light text-white">
                  <Send className="mr-2 h-4 w-4" />
                  Kirim Pesan
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Dengan mengirim pesan ini, Anda setuju dengan kebijakan privasi kami.
                  Kami akan merespons dalam 24 jam.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;