import React from 'react';
import { User, AppView } from '../types';
import { Brain, LogOut, User as UserIcon, LayoutDashboard, PlusCircle, Languages, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  user: User;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, onChangeView, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="glass no-print sticky top-0 z-50 transition-all duration-300 border-b" style={{
      borderColor: 'var(--color-border)',
      background: theme === 'dark'
        ? 'rgba(30, 41, 59, 0.8)'
        : 'rgba(255, 255, 255, 0.8)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => onChangeView('home')}
          >
            <div className="relative">
              <Brain className="h-8 w-8 mr-2 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-float"
                style={{ color: 'var(--color-accent)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 blur-xl rounded-full transition-opacity duration-300"
                style={{ background: 'var(--color-accent)' }} />
            </div>
            <span className="font-bold text-xl tracking-tight transition-all duration-300 group-hover:scale-105 gradient-text">
              {t('appTitle')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all duration-300 active:scale-95 hover:rotate-12"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)'
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="animate-fade-in" />
              ) : (
                <Moon size={18} className="animate-fade-in" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 border"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.05)' : 'rgba(99, 102, 241, 0.05)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Languages size={18} />
              <span className="font-semibold">{language === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {/* New Quiz Button */}
            <button
              onClick={() => onChangeView('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 btn-hover-lift ${currentView === 'home'
                  ? 'shadow-sm ring-1'
                  : ''
                }`}
              style={{
                color: currentView === 'home' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: currentView === 'home'
                  ? (theme === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.1)')
                  : 'transparent',
                borderColor: currentView === 'home' ? 'var(--color-accent)' : 'transparent'
              }}
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">{t('newQuiz')}</span>
            </button>

            {/* Admin Dashboard (if admin) */}
            {user.role === 'admin' && (
              <button
                onClick={() => onChangeView('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 btn-hover-lift ${currentView === 'admin'
                    ? 'shadow-sm ring-1'
                    : ''
                  }`}
                style={{
                  color: currentView === 'admin' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  backgroundColor: currentView === 'admin'
                    ? (theme === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.1)')
                    : 'transparent',
                  borderColor: currentView === 'admin' ? 'var(--color-accent)' : 'transparent'
                }}
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">{t('admin')}</span>
              </button>
            )}

            {/* Profile Button */}
            <button
              onClick={() => onChangeView('profile')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 btn-hover-lift ${currentView === 'profile'
                  ? 'shadow-sm ring-1'
                  : ''
                }`}
              style={{
                color: currentView === 'profile' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: currentView === 'profile'
                  ? (theme === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.1)')
                  : 'transparent',
                borderColor: currentView === 'profile' ? 'var(--color-accent)' : 'transparent'
              }}
            >
              <UserIcon size={18} />
              <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 hover:bg-red-50"
              style={{
                color: '#ef4444'
              }}
              title={t('logout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;