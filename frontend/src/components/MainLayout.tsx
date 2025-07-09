import { ReactNode } from 'react';
import { Header } from './Header';
import { PageWrapper } from './PageWrapper';
import { Sidebar } from './Sidebar';
import { RemoteFormModal } from './RemoteFormModal';
import { RemoteModal } from './RemoteModal';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="page">
      <RemoteFormModal />
      <RemoteModal />
      <Sidebar />
      <Header />
      <PageWrapper>
        {children}
      </PageWrapper>
    </div>
  );
}
