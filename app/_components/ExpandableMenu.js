'use client';

import { useEffect, useRef, useState } from 'react';

function ExpandableMenu({ children, icon, type }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  function toggleMenu() {
    setIsMenuOpen((cur) => !cur);
  }

  const handleClickOutside = (event) => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={`flex w-full justify-center items-center gap-2 text-xl ${type === 'nav' ? 'h-12 aspect-square' : ''} font-semibold p-3 bg-[var(--color-orange)] hover:bg-[var(--color-grey-tr-7)] text-black rounded-full focus:outline-none shadow-lg`}
      >
        {icon}
      </button>
      {isMenuOpen && (
        <ul
          className={`absolute ${type === 'nav' ? '-left-36' : ''} z-[55] w-48 mt-2 bg-[var(--color-orange-tr-5)] rounded-lg shadow-lg backdrop-blur-sm hover:rounded-lg`}
        >
          {children}
        </ul>
      )}
    </div>
  );
}

export default ExpandableMenu;
