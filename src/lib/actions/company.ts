'use server';

import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Company from '@/models/Company';
import UserCompany from '@/models/UserCompany';
import { getSession } from '@auth0/nextjs-auth0';

/**
 * Server Action: Create a new company and link the user as owner
 * @param name - Company name
 * @returns Object with success status or error
 */
export async function createCompany(name: string) {
   try {
      if (!name || name.trim().length === 0) {
         return { error: 'Company name is required' };
      }

      const session = await getSession();
      if (!session?.user) {
         return { error: 'Not authenticated' };
      }

      await connectDB();

      // 1. Create company document
      const company = await Company.create({
         name: name.trim(),
         slug: name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
         isActive: true,
      });

      // 2. Create UserCompany record linking user to company as owner
      await UserCompany.create({
         userId: session.user.sub,
         companyId: company._id,
         role: 'owner',
         email: session.user.email,
         firstName: session.user.given_name || '',
         lastName: session.user.family_name || '',
         isActive: true,
      });

      // 3. Redirect to dashboard with company context
      redirect(`/dashboard?companyId=${company._id.toString()}`);
   } catch (error) {
      console.error('Failed to create company:', error);
      return { error: 'Failed to create company' };
   }
}
