import { Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-1">
            <div className="flex items-center space-x-1.5 text-sm font-medium text-slate-900">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span> by Short<span className="text-primary-600">URL</span></span>
              <span className="text-slate-400 font-normal">© {currentYear}</span>
            </div>
          </div>
          <div className="flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
          </div>
          <div className="flex items-center space-x-5">
            <a
              href="https://github.com/itsAasmaan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-50 text-slate-600 hover:text-white hover:bg-slate-900 hover:-translate-y-1 transition-all duration-200"
              aria-label="Github"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/itsaasmaan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-50 text-slate-600 hover:text-white hover:bg-[#0077b5] hover:-translate-y-1 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;