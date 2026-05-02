'use client';

import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface DeleteWorkOrderButtonProps {
   workOrderId: string;
}

export default function DeleteWorkOrderButton({
   workOrderId,
}: DeleteWorkOrderButtonProps) {
   const router = useRouter();
   const params = useParams();
   const companyId = params.companyId;

   async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      e.stopPropagation();
      const confirmed = confirm('Are you sure you want to delete this work order?');
      if (!confirmed) return;

   
      
      try {
         const res = await fetch(`/api/work-orders/${workOrderId}`, {
            method: 'DELETE',
         });

         if (res.status === 403) {
            const data = await res.json();
            alert(data.message); // "Only a manager or owner can delete work orders."
            return;
         }

         if (!res.ok) {
            toast.error('Failed to delete work order');
            return;
         }

         toast.success('Work order deleted');
         

         // Navigate back to dashboard
         router.push(`/protectedPages/${companyId}/dashboard`);

         // // Ensure dashboard refreshes its data
         // router.refresh();
      } catch (err) {
         toast.error(`Delete Failed: ${err}`);
      }
   }

   return (
      <button
         type="button"
         onClick={handleDelete}
         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
      >
         Delete Work Order
      </button>
   );
}
