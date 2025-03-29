// "use client";

// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import useAuthStore from "../login/hooks/useAuthStore";

// const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const { user, logout } = useAuthStore();

//   const onLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}{user?.role === 4 && (
//       <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-md">
//         <div className="h-20 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//           <h1 className="text-2xl font-bold">GaraMS Admin</h1>
//         </div>
//         <nav className="flex-1 p-4">
//           <ul className="space-y-4">

//               <>
//               <li>
//                 <Link
//                   href="/dashboard"
//                   className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                 >
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/usermanagement"
//                   className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                 >
//                   User Management
//                 </Link>
//               </li>
//               </>

//           </ul>
//         </nav>
//         <button
//           onClick={onLogout}
//           className="m-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
//         >
//           Logout
//         </button>
//       </aside>
//       )}
// {user?.role === 3 && (
//       <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-md">
//         <div className="h-20 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//           <h1 className="text-2xl font-bold">GaraMS Manager</h1>
//         </div>
//         <nav className="flex-1 p-4">
//           <ul className="space-y-4">

//               <>
//                 <li>
//                   <Link
//                     href="/appointments"
//                     className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                   >
//                     Appointments
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/inventorymanagement"
//                     className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                   >
//                     Inventory - Supplier
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/servicemanagement"
//                     className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                   >
//                     Services
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/promotionmanagement"
//                     className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                   >
//                     Promotion
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/employeemanagement"
//                     className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                   >
//                     Employee
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     href="/reportmanagement"
//                     className="block px-4 py-2 rounded-lg hover:bg-gray-700"
//                   >
//                     Report
//                   </Link>
//                 </li>
//               </>

//           </ul>
//         </nav>
//         <button
//           onClick={onLogout}
//           className="m-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
//         >
//           Logout
//         </button>
//       </aside>
//       )}
//       {/* Main content */}
//       <main className="flex-1 p-6 overflow-auto">{children}</main>
//     </div>
//   );
// };

// export default ManagerLayout;
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "../login/hooks/useAuthStore";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {(user?.role === 4 || user?.role === 3 || user?.role === 2) && (
        <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-md">
          {/* Header */}
          <div className="h-20 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <h1 className="text-2xl font-bold">
              {user?.role === 4
                ? "GaraMS Admin"
                : user?.role === 3
                ? "GaraMS Manager"
                : "GaraMS Employee"}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-4">
              {user?.role === 4 ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/usermanagement"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      User Management
                    </Link>
                  </li>
                </>
              ) : user?.role === 3 ? (
                <>
                  <li>
                    <Link
                      href="/appointments"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Appointments
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/inventorymanagement"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Inventory - Supplier
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicemanagement"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/promotionmanagement"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Promotion
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/employeemanagement"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Employee
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reportmanagement"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Report
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/employeeappointments"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Appointments
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/employeeshift"
                      className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Shift
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold">
                {"U"}
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || "Email"}
                </p>
              </div>
            </div>
            <Link
              href={`/profiles/${user?.userId}`}
              className="mt-2 block text-blue-400 hover:text-blue-300 text-sm"
            >
              View Profile
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="m-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          >
            Logout
          </button>
        </aside>
      )}

      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default ManagerLayout;
