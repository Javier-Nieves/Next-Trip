import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/backpack.png';

function Logo() {
  return (
    <Link href="/" className="z-10 flex items-center gap-4">
      <Image
        src={logo}
        height="70"
        width="70"
        quality={80}
        alt="See the world logo"
      />
      <span className="z-10 text-4xl font-extrabold">See the World</span>
    </Link>
  );
}

export default Logo;
