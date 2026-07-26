'use client';

import { useCompanyStore } from '@/store/useCompanyStore';

/**
 * CompanyProvider: Initializes activeCompanyId in the store
 * Place this at the [companyId] route level to ensure all child components
 * have access to the active company context
 */
export default function CompanyProvider({
   children,
   companyId,
}: {
   children: React.ReactNode;
   companyId: string;
}) {
   useCompanyStore.setState({ activeCompanyId: companyId });

   return <>{children}</>;
}
