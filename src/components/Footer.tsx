import { Leaf, Heart, Facebook, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    "Tentang Kami": [
      { name: "Profil Colo Sagu", href: "#about" },
      { name: "Tim Kami", href: "#team" },
      { name: "Visi & Misi", href: "#mission" },
      { name: "Kolaborasi", href: "#collaboration" },
    ],
    Program: [
      { name: "Budidaya Sagu", href: "#cultivation" },
      { name: "Edukasi Pangan", href: "#education" },
      { name: "Pemberdayaan", href: "#empowerment" },
      { name: "Konservasi", href: "#conservation" },
    ],
    Dukungan: [
      { name: "Cara Donasi", href: "#donate" },
      { name: "Program Volunteer", href: "#volunteer" },
      { name: "Kemitraan", href: "#partnership" },
      { name: "Sponsorship", href: "#sponsor" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "mailto:info@colosagu.org", label: "Email" },
  ];

  return (
    <footer className="bg-gradient-to-b from-forest to-forest-light text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <img
                  src="/lovable-uploads/908c9c8a-4be9-4f88-a48c-d7b22f694a9b.png"
                  alt="Colo Sagu Nusantara"
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Membangun ketahanan pangan Papua yang berkelanjutan melalui
                pelestarian budaya pangan lokal dan pemberdayaan masyarakat.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sago transition-colors duration-200"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold mb-6 text-sago">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-white/80 hover:text-white transition-colors duration-200 hover:underline"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="border-t border-white/20 py-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="text-xl font-semibold mb-2 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-sago" />
                Berlangganan Newsletter
              </h4>
              <p className="text-white/80">
                Dapatkan update terbaru tentang program dan kegiatan Colo Sagu
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-sago"
              />
              <button className="px-6 py-3 bg-sago hover:bg-sago/80 rounded-lg font-medium transition-colors duration-200">
                Daftar
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Footer */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center text-white/80">
              <Heart className="w-4 h-4 mr-2 text-sago" />
              <span>Dibuat dengan ♥ untuk Papua</span>
            </div>
            <div className="text-white/80 text-sm">
              © 2024 Colo Sagu Nusantara. Semua hak dilindungi.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#privacy"
                className="text-white/80 hover:text-white transition-colors"
              >
                Kebijakan Privasi
              </a>
              <a
                href="#terms"
                className="text-white/80 hover:text-white transition-colors"
              >
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
