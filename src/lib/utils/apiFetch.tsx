import toast from 'react-hot-toast';

let sessionExpiredShown = false;

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
   const res = await fetch(input, init);

   if (res.status === 401 && !sessionExpiredShown) {
      sessionExpiredShown = true;
      const timer = setTimeout(() => {
         window.location.href = '/auth/login';
      }, 5000);

      toast.error(
         (t) => (
            <div className="flex flex-col gap-2">
               <span>Session expired — redirecting to login in 5 seconds…</span>
               <button
                  onClick={() => {
                     clearTimeout(timer);
                     sessionExpiredShown = false;
                     toast.dismiss(t.id);
                     toast.error(
                        'Session expired — click Logout in the header or refresh the page to log in and proceed.',
                        { duration: Infinity }
                     );
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm self-start"
               >
                  Cancel — I need to save my work
               </button>
            </div>
         ),
         { duration: Infinity }
      );
   }

   return res;
}
