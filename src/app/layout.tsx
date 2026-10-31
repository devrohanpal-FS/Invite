import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zareqia — Create All Events Invitation Webpage Online',
  description: 'Create ultra-luxury 3D digital wedding & event invitations with 3D Palace Gates, Scratch-to-reveal Date, Shagun UPI, and 1-click WhatsApp sharing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Italiana&family=Marcellus&family=Montserrat:wght@400;500;600;700&family=Parisienne&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Prata&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fbf8f1] text-[#2b2220] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
