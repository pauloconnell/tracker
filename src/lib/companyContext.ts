import { connectDB } from '@/lib/mongodb';
import UserCompany from '@/models/UserCompany';
import Company from '@/models/Company';
import type { IUserCompany } from '@/types/IUserCompany';
import type { ICompany } from '@/types/ICompany';

/**
 * Fetch all companies a user belongs to
 * @param userId - Auth0 sub
 * @returns Array of companies with user's role in each
 */
export async function getUserCompanies(userId: string): Promise<(ICompany & { role: string })[]> {
   try {
      await connectDB();

      const userCompanies = await UserCompany.find({
         userId,
         isActive: true,
      })
         .populate('companyId')
         .lean();

         console.log("This user ",userId,"has userCompanies:", userCompanies);
      return userCompanies.map((uc: any) => ({
         _id: uc.companyId?._id?.toString(),
         name: uc.companyId.name,
         slug: uc.companyId.slug,
         description: uc.companyId.description,
         email: uc.companyId.email,
         phone: uc.companyId.phone,
         address: uc.companyId.address,
         city: uc.companyId.city,
         state: uc.companyId.state,
         zipCode: uc.companyId.zipCode,
         country: uc.companyId.country,
         logo: uc.companyId.logo,
         isActive: uc.companyId.isActive,
         createdAt: uc.companyId.createdAt?.toISOString?.() ?? '',
         updatedAt: uc.companyId.updatedAt?.toISOString?.() ?? '',
         role: uc.role,
      }));
   } catch (error) {
      console.error('Failed to fetch user companies:', error);
      return [];
   }
}

/**
 * Check if user belongs to any company
 * @param userId - Auth0 sub
 * @returns true if user has at least one company
 */
export async function userHasCompany(userId: string): Promise<boolean> {
   try {
      await connectDB();

      const count = await UserCompany.countDocuments({
         userId,
         isActive: true,
      });

      return count > 0;
   } catch (error) {
      console.error('Failed to check user company membership:', error);
      return false;
   }
}

/**
 * Get user's primary (oldest/first) company - useful for fallback selection
 * @param userId - Auth0 sub
 * @returns First company user belongs to or null
 */
export async function getUserPrimaryCompany(userId: string): Promise<(ICompany & { role: string }) | null> {
   try {
      await connectDB();

      const userCompany = await UserCompany.findOne({
         userId,
         isActive: true,
      })
         .sort({ createdAt: 1 })
         .populate('companyId')
         .lean();

      if (!userCompany) return null;

      return {
         _id: userCompany.companyId._id.toString(),
         name: userCompany.companyId.name,
         slug: userCompany.companyId.slug,
         description: userCompany.companyId.description,
         email: userCompany.companyId.email,
         phone: userCompany.companyId.phone,
         address: userCompany.companyId.address,
         city: userCompany.companyId.city,
         state: userCompany.companyId.state,
         zipCode: userCompany.companyId.zipCode,
         country: userCompany.companyId.country,
         logo: userCompany.companyId.logo,
         isActive: userCompany.companyId.isActive,
         createdAt: userCompany.companyId.createdAt?.toISOString?.() ?? '',
         updatedAt: userCompany.companyId.updatedAt?.toISOString?.() ?? '',
         role: userCompany.role,
      };
   } catch (error) {
      console.error('Failed to fetch user primary company:', error);
      return null;
   }
}
