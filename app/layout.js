import { Raleway } from 'next/font/google';
import { EdgeStoreProvider } from './_lib/edgestore';
import Header from './_components/Header';
import Logo from './_components/Logo';

import './globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';

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
        <Header>
          <Logo />
        </Header>

        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </body>
    </html>
  );
}
