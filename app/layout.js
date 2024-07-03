import { Raleway } from 'next/font/google';
import Image from 'next/image';
import { EdgeStoreProvider } from './_lib/edgestore';
import Header from './_components/Header';
import Logo from './_components/Logo';
import back from '@/public/back.jpg';

import 'mapbox-gl/dist/mapbox-gl.css';
import './globals.css';

const raleway = Raleway({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s | See The World',
    default: 'See The World',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`flex relative flex-col min-h-screen antialiased ${raleway.className}`}
      >
        <Image
          src={back}
          placeholder="blur"
          quality={50}
          className="absolute top-0 -z-[100]"
          alt="Background image"
        />

        <Header>
          <Logo />
        </Header>

        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </body>
    </html>
  );
}
