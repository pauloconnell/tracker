import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'geist/font';
import './globals.css';
import HeaderServer from '@/components/Header/HeaderServer';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({ variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ variable: '--font-geist-mono' });

export const metadata: Metadata = {
   title: 'Maintence Tracker',
   description: 'Maintence Tracking Solution',
};


export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <HeaderServer />
            {children}
            <Toaster position="top-right" />
         </body>
      </html>
   );
}
