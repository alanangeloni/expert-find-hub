import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface PageLayoutProps {
  children?: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default PageLayout;
