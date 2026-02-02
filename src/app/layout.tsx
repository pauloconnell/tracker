import type { Metadata } from 'next';

import './globals.css';
import HeaderServer from '@/components/Header/HeaderServer';
import { Toaster } from 'react-hot-toast';


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
         <body >
            <HeaderServer />
            {children}
            <Toaster position="top-right" />
         </body>
      </html>
   );
}
