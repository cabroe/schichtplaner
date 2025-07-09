import { ReactNode } from 'react';
import { Header } from './Header';
import { PageWrapper } from './PageWrapper';
import { Sidebar } from './Sidebar';

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
