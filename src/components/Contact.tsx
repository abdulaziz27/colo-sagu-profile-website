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
      subtitle: "Kantor Pusat Colo Sagu Nusantara",
    },
    {
      icon: Phone,
      title: "Telepon",
      details: "+62 967 123 4567",
      subtitle: "Senin - Jumat, 08:00 - 17:00 WIT",
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@colosagu.org",
      subtitle: "Respon dalam 24 jam",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      details: "08:00 - 17:00 WIT",
      subtitle: "Senin sampai Jumat",
    },
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
            Mari bergabung dalam misi membangun ketahanan pangan Papua yang
            berkelanjutan
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Informasi Kontak
            </h3>

            <div className="grid gap-6 mb-8">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-forest" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h4>
                        <p className="text-lg text-forest font-medium mb-1">
                          {info.details}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {info.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div>
            <p className="text-2xl font-bold mb-4">Peta Lokasi Colo Sagu</p>
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-forest/10 to-sago/10">
                <div className="text-center py-6">
                  {/* <MapPin className="w-12 h-12 text-forest mx-auto mb-2" /> */}

                  <div className="w-full h-[400px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127546.25522430004!2d140.59862469978182!3d-2.56513540063997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x686c581e4ec6ff6b%3A0x26030bfcc0920592!2sJayapura%2C%20Kota%20Jayapura%2C%20Papua!5e0!3m2!1sid!2sid!4v1753950440851!5m2!1sid!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
