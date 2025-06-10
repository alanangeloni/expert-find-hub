
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}

export default PageLayout;
