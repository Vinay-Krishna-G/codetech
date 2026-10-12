import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  LogIn,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  History,
  PhoneCall,
  Search,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CodtechLogo } from './CodtechLogo';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Corporate Accreditation Strip */}
      <div className="bg-neutral-900 text-white text-[11px] py-1.5 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3 text-neutral-300">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ISO 9001:2015 Quality Certified
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-300">AICTE Affiliated Partner</span>
            <span className="hidden md:inline text-neutral-600">•</span>
            <span className="hidden md:inline text-neutral-300">Registered with MSME & #startupindia</span>
          </div>

          <div className="flex items-center space-x-4 text-neutral-300">
            <a
              href="tel:+919848925128"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-orange-400" />
              <span>HR Helpline: +91 9848925128</span>
            </a>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline text-neutral-400">Hyderabad, Telangana</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Authentic Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <CodtechLogo />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive('/')
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify Credential</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                    isActive('/admin')
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">HR Console</span>
                </Link>

                <Link
                  to="/admin/issue"
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                    isActive('/admin/issue')
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Issue Certificate</span>
                </Link>

                <Link
                  to="/admin/audit"
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                    isActive('/admin/audit')
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Audit Trail</span>
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth Action */}
            {user ? (
              <div className="flex items-center pl-2 space-x-2 border-l border-neutral-200 dark:border-neutral-800">
                <span className="hidden lg:inline text-xs font-semibold text-neutral-600 dark:text-neutral-300 max-w-[130px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center space-x-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
};
