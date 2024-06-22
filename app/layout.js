import { Inter } from 'next/font/google';
import Header from './_components/Header';
import Logo from './_components/Logo';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
        className={`flex relative flex-col min-h-screen antialiased ${inter.className}`}
      >
        <Header>
          <Logo />
        </Header>

        {children}
      </body>
    </html>
  );
}
