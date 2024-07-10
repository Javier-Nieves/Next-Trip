import Navigation from './Navigation';
import Logo from './Logo';

function Header() {
  return (
    <header className="px-1 py-3 sm:px-4">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
