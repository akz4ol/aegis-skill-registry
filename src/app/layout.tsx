import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AegisSkill Registry',
  description:
    'Governed registry and marketplace for AI agent skills with security manifests, policy gating, provenance, and observability linkage.',
  keywords: [
    'AI',
    'agent',
    'skills',
    'registry',
    'security',
    'governance',
    'SBOM',
  ],
  authors: [{ name: 'AegisSkill Team' }],
  openGraph: {
    title: 'AegisSkill Registry',
    description: 'Secure AI Agent Skill Marketplace',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-auto bg-muted/30 p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
