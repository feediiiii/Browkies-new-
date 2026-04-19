import { Phone, Instagram, MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080402] border-t border-white/5 py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍪</span>
              <span className="text-xl font-bold text-amber-300 font-serif">
                browkiezz<span className="text-white">by Hajer</span>
              </span>
            </div>
            <p className="text-amber-100/40 text-sm leading-relaxed">
              Authentic Tunisian cookies crafted with love and passed-down recipes. Fresh daily — order online and enjoy at home.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Our Cookies", href: "#menu" },
                { label: "Place an Order", href: "#order" },
                { label: "Track My Order", href: "#tracker" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-amber-100/40 hover:text-amber-300 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-amber-100/40 text-sm">
                <Phone size={14} className="text-amber-400" />
                +216 XX XXX XXX
              </li>
               <a
                  href="https://www.instagram.com/cookies_by_maryem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
              <li className="flex items-center gap-2 text-amber-100/40 text-sm">
               
                  <Instagram size={14} />
               
                
              </li>
                 </a>
              <li className="flex items-center gap-2 text-amber-100/40 text-sm">
                <MapPin size={14} className="text-amber-400" />
                Tunis, Tunisia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-amber-100/20 text-sm">© 2026 browkiezzbyHajer. All rights reserved.</p>
          <p className="text-amber-100/20 text-sm flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400" fill="currentColor" /> in Tunisia
          </p>
        </div>
      </div>
    </footer>
  );
}
