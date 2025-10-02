"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
// Import icons for the hamburger menu
import { FiMenu, FiX } from "react-icons/fi";

const AuthLinks = () => {
  const { data: session, status } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  // State to manage the mobile menu's open/closed status
  const [isOpen, setIsOpen] = useState(false);

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

  if (status === "loading") {
    return <div className="h-8 w-24 bg-slate-700 rounded-md animate-pulse" />;
  }

  // Define the common link styles for the mobile menu
  const mobileLinkStyles = "text-xl font-semibold text-slate-200 hover:text-blue-400";

  return (
    <>
      {/* ===== Desktop Menu (visible on medium screens and up) ===== */}
      <div className="hidden md:flex items-center space-x-4">
        {session ? (
          <>
            <Link href="/chats" className="relative text-slate-300 hover:text-blue-400">
              <span>Inbox</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <span className="text-sm text-slate-400">
              Hello, {session.user?.name?.split(' ')[0]}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3 py-1.5 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm font-bold text-slate-200 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* ===== Hamburger Icon (visible on small screens) ===== */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <FiMenu size={28} />
        </button>
      </div>

      {/* ===== Mobile Menu Overlay ===== */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 max-w-sm bg-slate-800/95 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-6">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <FiX size={30} />
          </button>
        </div>
        <nav className="flex flex-col items-center space-y-8 mt-10">
          {/* Main nav links duplicated for mobile */}
          <Link href="/ads" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>Browse Ads</Link>
          <Link href="/ads/new" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>Post Ad</Link>
          
          <hr className="w-2/3 border-slate-600"/>

          {/* Auth links for mobile */}
          {session ? (
            <>
              <Link href="/chats" onClick={() => setIsOpen(false)} className={`${mobileLinkStyles} relative`}>
                Inbox
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -left-6 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="text-xl font-semibold text-red-400 hover:text-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>Sign Up</Link>
              <Link href="/auth/signin" onClick={() => setIsOpen(false)} className="px-6 py-3 text-lg font-bold bg-blue-600 text-white rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors">
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default AuthLinks;