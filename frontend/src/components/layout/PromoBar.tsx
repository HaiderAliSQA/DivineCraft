import React from 'react';

const PromoBar: React.FC = () => {
  return (
    <div className="bg-black text-white text-[10px] sm:text-[11px] font-artisan-body font-bold py-2 w-full px-0 border-b border-white/10 z-[60] select-none">
      <div className="w-full flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
        
        {/* Left Side: Shipping offer */}
        <div className="text-center md:text-left md:pl-4 tracking-wider">
          Free Shipping on orders above Rs. 2990
        </div>
        
        {/* Center Side: Live Contacts */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-2 md:my-0 text-[10px] sm:text-[11px]">
          <a href="tel:+923007709173" className="flex items-center gap-1 hover:text-artisan-accent transition-all">
            <span className="text-xs">📞</span> Call Us <span className="font-mono text-gray-300 ml-1">+92-300-770-9173</span>
          </a>
          <a href="https://wa.me/923007709173" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#25D366] transition-all">
            <span className="text-xs">💬</span> WhatsApp
          </a>
        </div>

        {/* Right Side: Social Media SVG icons */}
        <div className="flex items-center gap-4 md:pr-4">
          <a href="#" className="hover:text-artisan-accent transition-all text-white/80" aria-label="Facebook">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
          </a>
          <a href="#" className="hover:text-artisan-accent transition-all text-white/80" aria-label="Instagram">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href="#" className="hover:text-artisan-accent transition-all text-white/80" aria-label="Twitter X">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" className="hover:text-artisan-accent transition-all text-white/80" aria-label="WhatsApp">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
          </a>
          <a href="#" className="hover:text-artisan-accent transition-all text-white/80" aria-label="Pinterest">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.007-4.869-3.41 0-5.413 2.561-5.413 5.2 0 1.037.397 2.149.9 2.761.1.12.115.223.085.345-.096.398-.31.1.258-.42-.039-.164-.091-.226-.299-.072-.886-1.023-1.37-1.557-1.37-2.518 0-3.278 2.385-6.29 6.879-6.29 3.61 0 6.42 2.571 6.42 6.013 0 3.593-2.26 6.485-5.397 6.485-1.053 0-2.044-.548-2.383-1.197l-.65 2.485c-.235.897-.872 2.022-1.298 2.716 1.002.311 2.064.478 3.167.478 6.62 0 11.986-5.366 11.986-11.985C24.002 5.368 18.636 0 12.017 0z"/></svg>
          </a>
        </div>

      </div>
    </div>
  );
};

export default PromoBar;
