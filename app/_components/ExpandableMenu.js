'use client';

import { useEffect, useRef, useState } from 'react';
import { FaListUl } from 'react-icons/fa';

function ExpandableMenu({ children }) {
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
        className="p-3 bg-[var(--color-orange)] hover:bg-[var(--color-light-yellow)] text-black rounded-full focus:outline-none shadow-lg"
      >
        <FaListUl />
      </button>
      {isMenuOpen && (
        <ul className="absolute -left-36 z-50 w-48 mt-2 bg-[var(--color-orange-tr-5)] rounded-lg shadow-lg backdrop-blur-sm hover:rounded-lg">
          {children}
        </ul>
      )}
    </div>
  );
}

export default ExpandableMenu;
