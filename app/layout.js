import { Raleway } from 'next/font/google';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import Providers from '@/app/_components/Providers';
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
        className={`flex relative flex-col min-h-screen w-screen antialiased ${raleway.className}`}
      >
        <div className="fixed top-0 left-0 inset-0 -z-[100]">
          <Image
            src={back}
            placeholder="blur"
            quality={70}
            fill
            className="bg-fixed pointer-events-none select-none"
            alt="Background image"
          />
        </div>

        <Header>
          <Logo />
        </Header>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 2000,
            },
            error: {
              duration: 3000,
            },
            style: {
              fontSize: '18px',
              maxWidth: '500px',
              padding: '14px 20px',
              backgroundColor: 'var(--color-lightest)',
              color: 'var(--color-grey-700)',
            },
          }}
        />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
