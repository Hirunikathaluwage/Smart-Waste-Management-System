import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineArrowRight } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';

const LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About Us', href: '#aboutus' },
  { name: 'Contact', href: '#contact' }
];

const CONTACTS = [
  { icon: HiOutlineMail, text: 'info@ecocollect.com', type: 'email' },
  { icon: HiOutlinePhone, text: '+1 (555) 123-4567', type: 'phone' },
  { icon: HiOutlineLocationMarker, text: '123 Green Street, Eco City', type: 'address' }
];

const SOCIAL_LINKS = [
  { name: 'Facebook', icon: '📘', href: '#' },
  { name: 'Twitter', icon: '🐦', href: '#' },
  { name: 'Instagram', icon: '📷', href: '#' },
  { name: 'LinkedIn', icon: '💼', href: '#' }
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#1f4d0a] via-[#2f7410] to-[#1f4d0a] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4CBB17] to-[#3d9613] rounded-lg flex items-center justify-center shadow-lg">
                <IoLeafOutline className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">EcoCollect</h3>
            </div>
            <p className="text-sm text-white leading-relaxed mb-6">
              Making waste management efficient and eco-friendly for a sustainable future. Together, we create cleaner communities.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-[#3d9613]/50 hover:bg-[#4CBB17] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center text-sm text-white hover:text-[#8fe060] transition-all duration-200"
                  >
                    <HiOutlineArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-200" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              {CONTACTS.map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.text} className="flex items-start group">
                    <div className="w-8 h-8 bg-[#3d9613]/50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-[#4CBB17] transition-colors duration-200">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white pt-1.5">
                      {contact.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Stay Updated</h3>
            <p className="text-sm text-white mb-4">
              Subscribe to our newsletter for eco-tips and updates.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg bg-[#3d9613]/30 border border-[#4CBB17]/30 text-white placeholder-white/60 focus:outline-none focus:border-[#4CBB17] focus:bg-[#3d9613]/50 transition-all duration-200 text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-[#4CBB17] to-[#3d9613] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#3d9613] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white text-center md:text-left">
              © {new Date().getFullYear()} EcoCollect. All rights reserved. Built with 💚 for a greener tomorrow.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="text-white hover:text-[#8fe060] transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="text-white hover:text-[#8fe060] transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
