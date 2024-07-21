import { Dancing_Script } from 'next/font/google';
import Image from 'next/image';
import logo from '../../public/backpack.png';
import Link from 'next/link';

const playFont = Dancing_Script({ subsets: ['latin'] });

function Logo() {
  return (
    <Link href="/" className="z-10 flex items-center gap-2">
      <Image
        src={logo}
        height="70"
        width="70"
        quality={80}
        alt="See the world logo"
      />
      <span
        className={`${playFont.className} z-10 tracking-tight text-3xl min-[400px]:text-5xl font-extrabold`}
      >
        See the World
      </span>
    </Link>
  );
}

export default Logo;
