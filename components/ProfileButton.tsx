"use client";

import { useState, useEffect } from "react";

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (!data.error) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict;`;
    window.location.reload();
  };

  // Generate initials from name for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-200 group"
      >
        {/* Avatar */}
        <div className="relative">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-700/50 animate-pulse border-2 border-slate-600/50"></div>
          ) : user ? (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fde047&color=000000`}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-slate-600/50"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-500/50 flex items-center justify-center">
              <span className="text-xs font-medium text-slate-200">?</span>
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
        </div>

        {/* Email and Chevron */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse"></div>
          ) : (
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              {user?.email || "Not signed in"}
            </span>
          )}
          <svg 
            className={`w-4 h-4 text-slate-400 group-hover:text-slate-300 transform transition-all duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-lg bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 shadow-xl shadow-black/20 z-50">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-slate-700/50 animate-pulse border-2 border-slate-600/50"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-slate-700/50 rounded animate-pulse"></div>
                  </div>
                </>
              ) : user ? (
                <>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=475569&color=e2e8f0`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600/50"
                  />
                  <div>
                    <h3 className="font-medium text-white">{user.name}</h3>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-500/50 flex items-center justify-center">
                    <span className="text-lg font-medium text-slate-200">?</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Not signed in</h3>
                    <p className="text-sm text-slate-400">Please sign in</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="p-2">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}