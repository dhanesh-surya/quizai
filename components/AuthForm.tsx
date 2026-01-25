import React, { useState } from 'react';
import { UserRole } from '../types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';
import { Brain, Lock, Mail, User as UserIcon, ArrowRight, Languages, Sparkles, Shield } from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useBackend] = useState(true); // Toggle to use backend

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (useBackend) {
        // Use backend API
        if (isLogin) {
          const response = await apiService.login(email, password);
          onLogin({
            id: response.user.id.toString(),
            name: response.user.name,
            email: response.user.email,
            password: '',
            role: response.user.is_admin ? 'admin' : 'user',
            history: []
          });
        } else {
          const response = await apiService.register({
            username: email.split('@')[0],
            email,
            password,
            first_name: name,
            admin_code: adminCode
          });
          onLogin({
            id: response.user.id.toString(),
            name: response.user.name,
            email: response.user.email,
            password: '',
            role: response.user.is_admin ? 'admin' : 'user',
            history: []
          });
        }
      } else {
        // Use localStorage (fallback)
        if (isLogin) {
          const user = storageService.login(email, password);
          if (user) {
            onLogin(user);
          } else {
            setError(language === 'hi' ? 'अमान्य ईमेल या पासवर्ड।' : 'Invalid email or password.');
            setIsSubmitting(false);
            return;
          }
        } else {
          const users = storageService.getUsers();
          if (users.find(u => u.email === email)) {
            setError(language === 'hi' ? 'इस ईमेल के साथ उपयोगकर्ता पहले से मौजूद है।' : 'User already exists with this email.');
            setIsSubmitting(false);
            return;
          }

          let role: UserRole = 'user';
          if (adminCode === 'admin123') {
            role = 'admin';
          }

          const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            password,
            role,
            history: []
          };

          storageService.saveUser(newUser);
          storageService.login(email, password);
          onLogin(newUser);
        }
      }
    } catch (err: any) {
      setError(err.message || (language === 'hi' ? 'कुछ गलत हो गया।' : 'Something went wrong.'));
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setAdminCode('');
  };

  return (
    <div className="w-full max-w-md card overflow-hidden relative animate-scale-in" style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border)',
      padding: '2.5rem',
    }}>
      {/* Animated background decoration */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none animate-pulse-custom" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }} />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none animate-pulse-custom delay-500" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }} />

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95 border"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.05)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <Languages size={14} />
          <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transform transition-transform hover:rotate-6 animate-float" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <Brain size={36} className="text-white" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl animate-glow" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.3,
            filter: 'blur(15px)',
            zIndex: -1
          }} />
        </div>
        <h1 className="text-3xl font-bold text-center tracking-tight mb-2" style={{
          color: 'var(--color-text-primary)'
        }}>
          {t('appTitle')}
        </h1>
        <p className="text-center animate-fade-in flex items-center gap-2" style={{
          color: 'var(--color-text-secondary)'
        }}>
          <Sparkles size={14} />
          {isLogin ? t('welcomeLogin') : t('welcomeSignup')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {!isLogin && (
          <div className="animate-fade-in-down">
            <label className="block text-sm font-medium mb-2" style={{
              color: 'var(--color-text-primary)'
            }}>
              {t('fullName')}
            </label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-4 transition-colors z-10" size={18} style={{
                color: 'var(--color-text-tertiary)'
              }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all outline-none font-medium"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                placeholder="John Doe"
                required={!isLogin}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-accent)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        )}

        <div className="animate-fade-in-down delay-75">
          <label className="block text-sm font-medium mb-2" style={{
            color: 'var(--color-text-primary)'
          }}>
            {t('email')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-4 transition-colors z-10" size={18} style={{
              color: 'var(--color-text-tertiary)'
            }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all outline-none font-medium"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              placeholder="you@example.com"
              required
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-accent)';
                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div className="animate-fade-in-down delay-150">
          <label className="block text-sm font-medium mb-2" style={{
            color: 'var(--color-text-primary)'
          }}>
            {t('password')}
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 transition-colors z-10" size={18} style={{
              color: 'var(--color-text-tertiary)'
            }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all outline-none font-medium"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              placeholder="••••••••"
              required
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-accent)';
                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {!isLogin && (
          <div className="animate-fade-in-down delay-200">
            <label className="block text-xs font-medium mb-2 flex items-center gap-1" style={{
              color: 'var(--color-text-secondary)'
            }}>
              <Shield size={14} />
              {t('adminCode')}
            </label>
            <input
              type="text"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm transition-all font-medium"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              placeholder={language === 'hi' ? 'व्यवस्थापक कोड (वैकल्पिक)' : 'Enter code to register as admin (optional)'}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-accent)';
                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in-down flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white font-bold py-4 rounded-xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 mt-2 animate-fade-in-down delay-200 btn-hover-lift disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              {isLogin ? t('login') : t('createAccount')}
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Toggle Mode */}
      <div className="mt-6 text-center animate-fade-in delay-300 relative z-10">
        <button
          onClick={toggleMode}
          className="text-sm font-medium hover:underline transition-all transform hover:scale-105"
          style={{
            color: 'var(--color-accent)'
          }}
        >
          {isLogin ? t('noAccount') : t('hasAccount')}
        </button>
      </div>

      {/* Footer Help Text */}
      <p className="text-xs text-center mt-6 animate-fade-in delay-400" style={{
        color: 'var(--color-text-tertiary)'
      }}>
        {language === 'hi'
          ? '🔒 आपकी जानकारी सुरक्षित एवं गोपनीय है'
          : '🔒 Your data is secure and private'}
      </p>
    </div>
  );
};

export default AuthForm;