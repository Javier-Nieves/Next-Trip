import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  template: '%s / See The World',
  default: 'Welcome / See The World',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`flex relative flex-col text-primary-100 min-h-screen antialiased ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
