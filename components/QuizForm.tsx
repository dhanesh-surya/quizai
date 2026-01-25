import React, { useState } from 'react';
import { Difficulty } from '../types';
import { Brain, Sparkles, Loader2, Zap, TrendingUp, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface QuizFormProps {
  onGenerate: (topic: string, difficulty: Difficulty, count: number) => void;
  isLoading: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ onGenerate, isLoading }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, difficulty, count);
    }
  };

  const difficultyIcons = {
    [Difficulty.Easy]: Target,
    [Difficulty.Medium]: TrendingUp,
    [Difficulty.Hard]: Zap,
  };

  const difficultyColors = {
    [Difficulty.Easy]: '#10b981',
    [Difficulty.Medium]: '#f59e0b',
    [Difficulty.Hard]: '#ef4444',
  };

  return (
    <div className="w-full max-w-md card overflow-hidden animate-fade-in-up" style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border)',
      padding: '2rem',
    }}>
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }} />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }} />

      <div className="flex flex-col items-center mb-8 relative z-10">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <Brain size={36} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl animate-glow" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.3,
            filter: 'blur(10px)',
            zIndex: -1
          }} />
        </div>
        <h1 className="text-3xl font-bold text-center tracking-tight mb-2" style={{
          color: 'var(--color-text-primary)'
        }}>
          {t('appTitle')}
        </h1>
        <p className="text-center leading-relaxed" style={{
          color: 'var(--color-text-secondary)'
        }}>
          {t('generateDesc')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Topic Input */}
        <div className="animate-fade-in-up delay-100">
          <label htmlFor="topic" className="block text-sm font-semibold mb-2 ml-1" style={{
            color: 'var(--color-text-primary)'
          }}>
            {t('quizTopic')}
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t('topicPlaceholder')}
            className="w-full px-5 py-4 rounded-xl border-2 transition-all outline-none font-medium"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-accent)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            required
            disabled={isLoading}
          />
        </div>

        {/* Difficulty & Count Grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* Difficulty Selector */}
          <div className="animate-fade-in-up delay-150">
            <label htmlFor="difficulty" className="block text-sm font-semibold mb-2 ml-1" style={{
              color: 'var(--color-text-primary)'
            }}>
              {t('difficulty')}
            </label>
            <div className="relative">
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-4 py-4 rounded-xl border-2 outline-none appearance-none cursor-pointer transition-all font-medium"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                disabled={isLoading}
              >
                <option value={Difficulty.Easy}>{t('easy')}</option>
                <option value={Difficulty.Medium}>{t('medium')}</option>
                <option value={Difficulty.Hard}>{t('hard')}</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all" style={{
                color: difficultyColors[difficulty]
              }}>
                {React.createElement(difficultyIcons[difficulty], { size: 20 })}
              </div>
            </div>
          </div>

          {/* Question Count */}
          <div className="animate-fade-in-up delay-200">
            <label htmlFor="count" className="block text-sm font-semibold mb-2 ml-1" style={{
              color: 'var(--color-text-primary)'
            }}>
              {t('questionsCount')} <span className="font-bold" style={{
                color: 'var(--color-accent)'
              }}>({count})</span>
            </label>
            <div className="h-[58px] flex items-center px-2 rounded-xl border-2 transition-all" style={{
              backgroundColor: theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 0.8)',
              borderColor: 'var(--color-border)',
            }}>
              <input
                type="range"
                id="count"
                min="3"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full cursor-pointer"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full text-white font-bold py-4 rounded-xl shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 mt-2 animate-fade-in-up delay-300 btn-hover-lift disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background: isLoading || !topic.trim()
              ? 'var(--color-border)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={22} />
              <span className="animate-pulse">{t('generating')}</span>
            </>
          ) : (
            <>
              <Sparkles size={22} />
              {t('generate')}
            </>
          )}
        </button>

        {/* Help Text */}
        <p className="text-xs text-center animate-fade-in delay-400" style={{
          color: 'var(--color-text-tertiary)'
        }}>
          ✨ Powered by AI • Create quizzes on any topic
        </p>
      </form>
    </div>
  );
};

export default QuizForm;