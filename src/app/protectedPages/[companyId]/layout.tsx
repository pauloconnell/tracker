import CompanyProvider from '@/components/CompanyProvider';
import { ReactNode } from 'react';

interface CompanyLayoutProps {
   children: ReactNode;
params: { companyId: string };
}

export default async function CompanyLayout({ children, params }: CompanyLayoutProps) {
   const { companyId } = params;

   return (
      <CompanyProvider companyId={companyId}>
         {children}
      </CompanyProvider>
   );
}
