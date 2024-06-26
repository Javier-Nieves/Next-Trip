import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/backpack.png';

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      <Image
        src={logo}
        height="70"
        width="70"
        quality={80}
        alt="See the world logo"
      />
      {/* <span className="text-xl font-semibold text-primary-100">
        See the World
      </span> */}
    </Link>
  );
}

export default Logo;
