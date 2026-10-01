import React, { useState, useRef, useEffect } from 'react';
import { User, authService } from '../../services/authService';
import { ChevronDown, User as UserIcon, Settings, LogOut, ShieldCheck, X, Mail, Phone } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
}

export const UserMenu: React.FC<Props> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'profile' | 'settings' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const contactDisplay = user.email || user.phoneNumber || 'User';

  return (
    <>
      <div className="relative inline-block text-left" ref={menuRef}>
        {/* User section button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-expanded={isOpen}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition-all cursor-pointer text-left border border-white/15 backdrop-blur-md shadow-sm"
        >
          {/* Avatar */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-7 h-7 rounded-full object-cover border border-cyan-400/40 shadow-sm"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-black font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {getInitials(user.fullName)}
            </div>
          )}

          {/* User Name & Email or Phone */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-white truncate max-w-[130px]">
              {user.fullName || 'User'}
            </span>
            <span className="text-[10px] text-gray-400 truncate max-w-[130px]">
              {contactDisplay}
            </span>
          </div>

          {/* Chevron */}
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-0.5" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0b101c]/85 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] py-1.5 z-50 text-slate-200 text-xs animate-in fade-in duration-100">
            <div className="px-3.5 py-2.5 border-b border-white/10 mb-1">
              <p className="font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-[11px] text-gray-400 truncate">{contactDisplay}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 uppercase">
                  {user.authMethod ? `Via ${user.authMethod}` : 'Authenticated'}
                </span>
                {user.role && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/[0.08] text-gray-300 border border-white/10">
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('profile');
              }}
              type="button"
              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-cyan-400" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('settings');
              }}
              type="button"
              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Settings</span>
            </button>

            <div className="border-t border-white/10 my-1" />

            <button
              onClick={handleLogout}
              type="button"
              className="w-full px-3.5 py-2 text-left flex items-center gap-2.5 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141a24] border border-[#263347] rounded-2xl p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-blue-400" />
                <span>User Profile</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1e2736] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {getInitials(user.fullName)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{user.fullName}</h4>
                <p className="text-xs text-slate-400">{contactDisplay}</p>
                <p className="text-xs text-blue-400 mt-0.5">{user.role || 'Intelligence Analyst'}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-[#0e131b] p-3.5 rounded-xl border border-[#1f2838]">
              <div className="flex justify-between py-1 border-b border-[#1c2432]">
                <span className="text-slate-400">Account ID:</span>
                <span className="font-mono text-slate-200">{user.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1c2432]">
                <span className="text-slate-400">Authentication Method:</span>
                <span className="font-medium text-blue-400 capitalize">{user.authMethod || 'Standard'}</span>
              </div>
              {user.email && (
                <div className="flex justify-between py-1 border-b border-[#1c2432]">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-200">{user.email}</span>
                </div>
              )}
              {user.phoneNumber && (
                <div className="flex justify-between py-1 border-b border-[#1c2432]">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-200">{user.phoneNumber}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Session Status:</span>
                <span className="text-emerald-400 font-semibold">Active &bull; Verified</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141a24] border border-[#263347] rounded-2xl p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-[#222c3d] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                <span>Account Settings</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1e2736] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0e131b] border border-[#1f2838] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Decision Notifications</p>
                  <p className="text-slate-400 text-[11px]">Receive alerts for elevated tactical thresholds</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-0" />
              </div>

              <div className="p-3 bg-[#0e131b] border border-[#1f2838] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Two-Factor SMS Verification</p>
                  <p className="text-slate-400 text-[11px]">Require OTP on new browser sessions</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-0" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
