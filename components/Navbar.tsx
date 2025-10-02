// "use client";

// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
// import { cn } from "@/lib/utils"; 
// // === ADD IMAGE IMPORT ===
// import Image from "next/image"; 
// // ========================

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Effect to lock body scroll when menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//     return () => { document.body.style.overflow = 'auto'; };
//   }, [isMobileMenuOpen]);

//   // Define links for guests and logged-in users
//   const guestLinks = [
//     { href: "/ads", label: "Browse Ads" },
//   ];
//   const userLinks = [
//     { href: "/ads", label: "Browse Ads" },
//     { href: "/my-ads", label: "My Ads" },
//     { href: "/ads/new", label: "Post Ad" },
//   ];
//   const navLinks = session ? userLinks : guestLinks;

//   useEffect(() => {
//     if (status === "authenticated") {
//       const fetchUnreadCount = async () => {
//         try {
//           // Use a simple fetch to avoid complex client-side logic in the example
//           const res = await fetch("/api/chats/unread-count");
//           if (res.ok) {
//             const data = await res.json();
//             setUnreadCount(data.count);
//           }
//         } catch (error) {
//           console.error("Failed to fetch unread count:", error);
//         }
//       };
//       fetchUnreadCount();
//       const interval = setInterval(fetchUnreadCount, 30000);
//       return () => clearInterval(interval);
//     } else {
//       setUnreadCount(0);
//     }
//   }, [status]);

//   const closeMobileMenu = () => setIsMobileMenuOpen(false);

//   return (
//     <>
//       {/* ===== The Main Navbar - Cooler Blue Theme and Frosted Effect ===== */}
//       <nav className="bg-sky-950/85 backdrop-blur-lg border-b border-sky-800 p-4 sticky top-0 z-50 transition-colors duration-300">
//         <div className="container mx-auto flex justify-between items-center">
          
//           {/* === LOGO REPLACEMENT: Using Image component === */}
//           <Link href="/" onClick={closeMobileMenu} className="flex items-center">
//             <div className="relative h-10 w-10 flex-shrink-0 rounded-full"> {/* Adjusted size slightly */}
//                 <Image
//                     src="/logo.png" // <== YOUR LOGO PATH HERE (e.g., /images/logo.png or /logo.svg)
//                     alt="Dgram" 
//                     fill // Fills the parent div
//                     style={{ objectFit: 'contain' }} // Ensures the logo is contained
//                     priority 
//                 />
//             </div>
//              {/* Optional: Keep a text name next to the logo on desktop */}
//              <span className="ml-3 text-2xl font-extrabold tracking-wider text-white hidden sm:inline">AdGram</span>
//           </Link>
//           {/* ============================================== */}

//           {/* Desktop Navigation - Sleeker, high-contrast links */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navLinks.map((link) => (
//               <Link 
//                 key={link.href} 
//                 href={link.href} 
//                 className="text-slate-200 font-semibold tracking-wide hover:text-sky-400 transition-colors duration-200"
//               >
//                 {link.label}
//               </Link>
//             ))}
//             {status === "loading" ? (
//               <div className="h-8 w-24 bg-sky-900 rounded-md animate-pulse" />
//             ) : session ? (
//               <>
//                 {/* Inbox Link with Badge */}
//                 <Link href="/chats" className="relative text-slate-200 font-semibold tracking-wide hover:text-sky-400 transition-colors duration-200">
//                   Inbox
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-extrabold text-white animate-pulse">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </Link>
//                 {/* Sign Out Button - Clearer distinction */}
//                 <button onClick={() => signOut({ callbackUrl: "/" })} className="px-4 py-1.5 text-sm font-bold tracking-wider bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-all duration-200">
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               // Sign In Button - Matching the primary accent of the landing page
//               <Link href="/auth/signin" className="px-5 py-2 text-sm font-extrabold tracking-wider bg-sky-600 text-white rounded-full shadow-xl shadow-sky-500/30 hover:bg-sky-700 transform hover:scale-[1.02] transition-all duration-300">
//                 Sign In
//               </Link>
//             )}
//           </div>

//           {/* Mobile Toggle Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="text-sky-400 p-1 transition-colors duration-200 hover:bg-sky-900 rounded-lg"
//               aria-label="Toggle navigation menu"
//             >
//               <FiMenu size={28} />
//             </button>
//           </div>
          
//         </div>
//       </nav>

//       {/* ===== Mobile Menu Overlay and Panel (Cooler Look) ===== */}
//       <div
//         className={cn(
//           "fixed inset-0 bg-sky-950/70 z-40 transition-opacity md:hidden", // Darker blue overlay
//           isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         )}
//         onClick={closeMobileMenu}
//       ></div>
//       <div
//         className={cn(
//           "fixed top-0 right-0 h-full w-3/4 max-w-sm bg-sky-900 z-50 transition-transform duration-300 ease-in-out md:hidden shadow-2xl shadow-sky-950/50", // Cool, slightly lighter blue panel
//           isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
//         )}
//       >
//         {/* Dedicated Close Button */}
//         <div className="flex justify-end p-6">
//           <button onClick={closeMobileMenu} className="text-sky-400 transition-colors hover:text-white" aria-label="Close navigation menu">
//             <FiX size={30} />
//           </button>
//         </div>
//         <nav className="flex flex-col space-y-8 px-8 mt-4">
//           {navLinks.map((link) => (
//             <Link 
//               key={link.href} 
//               href={link.href} 
//               onClick={closeMobileMenu} 
//               className="text-2xl text-left text-white font-bold tracking-wider border-b border-sky-800 pb-2 hover:text-sky-400 transition-colors"
//             >
//               {link.label}
//             </Link>
//           ))}
//           <div className="pt-4">
//             {session ? (
//               <>
//                 <Link href="/chats" onClick={closeMobileMenu} className="relative block text-2xl text-left text-white font-bold tracking-wider hover:text-sky-400 transition-colors mb-6">
//                   Inbox
//                   {/* Enhanced badge for mobile */}
//                   {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-red-600 text-sm font-extrabold text-white">{unreadCount}</span>}
//                 </Link>
//                 <button
//                   onClick={() => {
//                     closeMobileMenu();
//                     signOut({ callbackUrl: "/" });
//                   }}
//                   className="text-2xl text-left text-red-500 font-bold tracking-wider hover:text-red-400 transition-colors"
//                 >
//                   Sign Out
//                 </button>
                
//               </>
//             ) : (
//               <div className="flex flex-col space-y-4">
//                 <Link href="/auth/signup" onClick={closeMobileMenu} className="text-2xl text-left text-white font-bold tracking-wider hover:text-sky-400 transition-colors">
//                   Sign Up
//                 </Link>
//                 <Link
//                   href="/auth/signin"
//                   onClick={closeMobileMenu}
//                   className="w-full mt-4 px-6 py-3 text-lg text-center font-extrabold tracking-wider bg-sky-600 text-white rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-700 transition-colors"
//                 >
//                   Sign In
//                 </Link>
//               </div>
//             )}
//           </div>
//         </nav>
//       </div>
//     </>
//   );
// }


"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect to lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  // Define links for guests and logged-in users
  const guestLinks = [
    { href: "/ads", label: "Browse Ads" },
  ];
  const userLinks = [
    { href: "/ads", label: "Browse Ads" },
    { href: "/my-ads", label: "My Ads" },
    { href: "/ads/new", label: "Post Ad" },
  ];
  const navLinks = session ? userLinks : guestLinks;

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUnreadCount = async () => {
        try {
          const res = await fetch("/api/chats/unread-count");
          if (res.ok) {
            const data = await res.json();
            setUnreadCount(data.count);
          }
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      };
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [status]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* ===== The Main Navbar - Cooler Blue Theme and Frosted Effect ===== */}
      <nav className="bg-sky-950/85 backdrop-blur-lg border-b border-sky-800 p-4 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          
          <Link href="/" onClick={closeMobileMenu} className="flex items-center">
            <div className="relative h-10 w-10 flex-shrink-0 rounded-full">
                <Image
                    src="/logo.png"
                    alt="Dgram" 
                    fill
                    style={{ objectFit: 'contain' }}
                    priority 
                />
            </div>
             {/* === MODIFIED LINE: Gradient Text Added Here === */}
             <span className="ml-3 text-2xl font-extrabold tracking-wider bg-gradient-to-r from-sky-400 to-fuchsia-500 bg-clip-text text-transparent hidden sm:inline">AdGram</span>
             {/* ================================================= */}
          </Link>

          {/* Desktop Navigation - Sleeker, high-contrast links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-slate-200 font-semibold tracking-wide hover:text-sky-400 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {status === "loading" ? (
              <div className="h-8 w-24 bg-sky-900 rounded-md animate-pulse" />
            ) : session ? (
              <>
                <Link href="/chats" className="relative text-slate-200 font-semibold tracking-wide hover:text-sky-400 transition-colors duration-200">
                  Inbox
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-extrabold text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="px-4 py-1.5 text-sm font-bold tracking-wider bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg transition-all duration-200">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin" className="px-5 py-2 text-sm font-extrabold tracking-wider bg-sky-600 text-white rounded-full shadow-xl shadow-sky-500/30 hover:bg-sky-700 transform hover:scale-[1.02] transition-all duration-300">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-sky-400 p-1 transition-colors duration-200 hover:bg-sky-900 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              <FiMenu size={28} />
            </button>
          </div>
          
        </div>
      </nav>

      {/* ===== Mobile Menu Overlay and Panel (Cooler Look) ===== */}
      <div
        className={cn(
          "fixed inset-0 bg-sky-950/70 z-40 transition-opacity md:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobileMenu}
      ></div>
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-3/4 max-w-sm bg-sky-900 z-50 transition-transform duration-300 ease-in-out md:hidden shadow-2xl shadow-sky-950/50",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end p-6">
          <button onClick={closeMobileMenu} className="text-sky-400 transition-colors hover:text-white" aria-label="Close navigation menu">
            <FiX size={30} />
          </button>
        </div>
        <nav className="flex flex-col space-y-8 px-8 mt-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={closeMobileMenu} 
              className="text-2xl text-left text-white font-bold tracking-wider border-b border-sky-800 pb-2 hover:text-sky-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            {session ? (
              <>
                <Link href="/chats" onClick={closeMobileMenu} className="relative block text-2xl text-left text-white font-bold tracking-wider hover:text-sky-400 transition-colors mb-6">
                  Inbox
                  {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-red-600 text-sm font-extrabold text-white">{unreadCount}</span>}
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-2xl text-left text-red-500 font-bold tracking-wider hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
                
              </>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link href="/auth/signup" onClick={closeMobileMenu} className="text-2xl text-left text-white font-bold tracking-wider hover:text-sky-400 transition-colors">
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  onClick={closeMobileMenu}
                  className="w-full mt-4 px-6 py-3 text-lg text-center font-extrabold tracking-wider bg-sky-600 text-white rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}