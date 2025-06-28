import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageWrapper } from './PageWrapper';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="page">
      <Sidebar />
      <Header />
      <PageWrapper>
        {children}
      </PageWrapper>
    </div>
  );
}
