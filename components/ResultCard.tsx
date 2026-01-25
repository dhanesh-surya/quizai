import React from 'react';
import { QuizResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, RefreshCw, Trophy, Target, TrendingUp, Sparkles, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface ResultCardProps {
  result: QuizResult;
  onRetry: () => void;
  onDownload: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onRetry, onDownload }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const data = [
    { name: t('correct'), value: result.correctAnswers },
    { name: t('incorrect'), value: result.totalQuestions - result.correctAnswers },
  ];

  const COLORS = theme === 'dark' ? ['#818cf8', '#334155'] : ['#6366f1', '#e2e8f0'];

  const handlePrint = () => {
    onDownload();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'MindSpark AI Quiz Result',
      text: `I scored ${result.scorePercentage}% on "${result.topic}" quiz! 🎯`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(`I scored ${result.scorePercentage}% on "${result.topic}" quiz! 🎯`);
      alert('Result copied to clipboard!');
    }
  };

  const getPerformanceMessage = () => {
    const percentage = result.scorePercentage;
    if (percentage === 100) return { text: '🎉 Perfect Score!', color: '#10b981' };
    if (percentage >= 80) return { text: '⭐ Excellent!', color: '#10b981' };
    if (percentage >= 60) return { text: '👍 Good Job!', color: '#f59e0b' };
    if (percentage >= 40) return { text: '💪 Keep Practicing!', color: '#f59e0b' };
    return { text: '📚 Room for Improvement', color: '#ef4444' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="w-full max-w-2xl card p-8 animate-fade-in relative overflow-visible" style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border)',
    }}>
      {/* Background decoration - reduced complexity */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-xl pointer-events-none -mr-10 -mt-10" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }} />

      {/* Confetti-like sparkles */}
      {result.scorePercentage >= 80 && (
        <>
          <Sparkles className="absolute top-10 right-10 text-yellow-400 animate-pulse-custom" size={24} />
          <Sparkles className="absolute top-20 left-10 text-purple-400 animate-pulse-custom delay-300" size={20} />
          <Sparkles className="absolute bottom-20 right-20 text-pink-400 animate-pulse-custom delay-500" size={18} />
        </>
      )}

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 animate-float" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <Trophy size={36} className="text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-2 tracking-tight animate-fade-in-down" style={{
          color: 'var(--color-text-primary)'
        }}>
          {t('quizCompleted')}
        </h2>
        <p className="text-lg animate-fade-in-down delay-100" style={{
          color: 'var(--color-text-secondary)'
        }}>
          {t('performanceSummary')} <span className="font-semibold gradient-text">"{result.topic}"</span>
        </p>
        <div className="mt-4 inline-block px-6 py-2 rounded-full font-bold text-lg animate-fade-in-down delay-200" style={{
          backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.15)' : 'rgba(99, 102, 241, 0.1)',
          color: performance.color
        }}>
          {performance.text}
        </div>
      </div>

      {/* Main Stats Display */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-10 relative z-10">
        {/* Pie Chart */}
        <div className="h-64 w-64 relative animate-fade-in delay-200">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Score Display */}
          <div className="absolute inset-0 flex items-center justify-center flex-col animate-fade-in delay-500">
            <span className="text-5xl font-extrabold mb-1 gradient-text">
              {result.scorePercentage}%
            </span>
            <span className="text-xs uppercase font-bold tracking-widest" style={{
              color: 'var(--color-text-tertiary)'
            }}>
              {t('score')}
            </span>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full animate-glow -z-10" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.1,
            filter: 'blur(40px)',
          }} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs animate-slide-in-right delay-300">
          {/* Correct Answers */}
          <div className="p-6 rounded-2xl border-2 text-center transform transition-all hover:scale-105 hover:-translate-y-1 relative overflow-hidden" style={{
            backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
            borderColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)',
          }}>
            <div className="absolute top-2 right-2 opacity-20">
              <Target size={32} className="text-green-600" />
            </div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#10b981' }}>
              {result.correctAnswers}
            </div>
            <div className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#059669' }}>
              {t('correct')}
            </div>
          </div>

          {/* Incorrect Answers */}
          <div className="p-6 rounded-2xl border-2 text-center transform transition-all hover:scale-105 hover:-translate-y-1 relative overflow-hidden" style={{
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
          }}>
            <div className="absolute top-2 right-2 opacity-20">
              <TrendingUp size={32} className="text-red-600" />
            </div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#ef4444' }}>
              {result.totalQuestions - result.correctAnswers}
            </div>
            <div className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#dc2626' }}>
              {t('incorrect')}
            </div>
          </div>

          {/* Total Questions */}
          <div className="col-span-2 p-5 rounded-2xl border-2 text-center transform transition-all hover:scale-105 hover:-translate-y-1" style={{
            backgroundColor: theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.05)',
            borderColor: 'var(--color-border)',
          }}>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>
              {result.totalQuestions} Questions
            </div>
            <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>
              Difficulty: <span className="font-bold">{result.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-500 relative z-10">
        <button
          onClick={handlePrint}
          className="flex-1 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 btn-hover-lift"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Download size={20} />
          {t('downloadCert')}
        </button>

        <button
          onClick={handleShare}
          className="px-6 py-4 rounded-xl font-bold text-lg shadow-md transform transition-all duration-300 flex items-center justify-center gap-2 btn-hover-lift border-2"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <Share2 size={20} />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={onRetry}
          className="flex-1 px-6 py-4 rounded-xl font-bold text-lg shadow-md transform transition-all duration-300 flex items-center justify-center gap-2 btn-hover-lift border-2"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <RefreshCw size={20} />
          {t('createNew')}
        </button>
      </div>

      <p className="text-center text-xs mt-8 animate-fade-in delay-700" style={{
        color: 'var(--color-text-tertiary)'
      }}>
        {t('certTip')}
      </p>
    </div>
  );
};

export default ResultCard;