import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ClimaSense Dashboard',
  description: 'Climate-health monitoring platform for ISIR Ghana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
