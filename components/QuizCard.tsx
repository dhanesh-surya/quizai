import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, Clock, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface QuizCardProps {
  question: Question;
  currentNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: number, isCorrect: boolean) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentNumber,
  totalQuestions,
  onAnswer,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
  React.useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question]);

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === question.correctIndex;
    onAnswer(selectedOption, isCorrect);
  };

  const getOptionStyle = (index: number) => {
    if (!isSubmitted) {
      return {
        borderColor: selectedOption === index ? 'var(--color-accent)' : 'var(--color-border)',
        backgroundColor: selectedOption === index
          ? (theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.05)')
          : 'var(--color-bg-secondary)',
        transform: selectedOption === index ? 'scale(1.02)' : 'scale(1)',
      };
    }

    if (index === question.correctIndex) {
      return {
        borderColor: '#10b981',
        backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        transform: 'scale(1.02)',
        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
      };
    }

    if (index === selectedOption && index !== question.correctIndex) {
      return {
        borderColor: '#ef4444',
        backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
        transform: 'scale(1)',
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)',
      };
    }

    return {
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-bg-secondary)',
      opacity: '0.5',
    };
  };

  const questionText = t('questionOf')
    .replace('{current}', currentNumber.toString())
    .replace('{total}', totalQuestions.toString());

  const progressPercentage = (currentNumber / totalQuestions) * 100;

  return (
    <div className="w-full max-w-2xl card p-6 md:p-8 animate-fade-in relative overflow-hidden" style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border)',
    }}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <Award size={20} className="text-white" />
          </div>
          <span className="px-4 py-2 rounded-full text-sm font-bold tracking-wide" style={{
            background: theme === 'dark' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.1)',
            color: 'var(--color-accent)'
          }}>
            {questionText}
          </span>
        </div>

        {/* Progress Circle */}
        <div className="relative w-14 h-14">
          <svg className="transform -rotate-90" width="56" height="56">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="var(--color-border)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${progressPercentage * 1.51} 151`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {currentNumber}/{totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed animate-slide-in-left relative z-10" style={{
        color: 'var(--color-text-primary)'
      }}>
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8 relative z-10">
        {question.options.map((option, index) => {
          const optionStyle = getOptionStyle(index);
          const isCorrect = index === question.correctIndex;
          const isWrong = isSubmitted && index === selectedOption && index !== question.correctIndex;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={isSubmitted}
              className="w-full text-left p-5 rounded-xl border-2 transition-all duration-300 flex justify-between items-center group relative overflow-hidden"
              style={{
                ...optionStyle,
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Shimmer effect on hover */}
              {!isSubmitted && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent)',
                  transform: 'translateX(-100%)',
                  animation: !isSubmitted ? 'shimmer 2s infinite' : 'none',
                }} />
              )}

              <span className="font-medium text-lg relative z-10" style={{
                color: isCorrect && isSubmitted ? '#10b981' : isWrong ? '#ef4444' : 'var(--color-text-primary)'
              }}>
                {option}
              </span>

              <div className="transition-transform duration-300 relative z-10">
                {isSubmitted && isCorrect && (
                  <div className="animate-scale-in">
                    <CheckCircle2 className="text-green-600" size={24} />
                  </div>
                )}
                {isSubmitted && isWrong && (
                  <div className="animate-scale-in">
                    <XCircle className="text-red-600" size={24} />
                  </div>
                )}
                {!isSubmitted && (
                  <div
                    className="w-6 h-6 rounded-full border-2 transition-all duration-300"
                    style={{
                      borderColor: selectedOption === index ? 'var(--color-accent)' : 'var(--color-border)',
                      backgroundColor: selectedOption === index ? 'var(--color-accent)' : 'transparent',
                    }}
                  >
                    {selectedOption === index && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isSubmitted && (
        <div className="rounded-2xl p-5 mb-6 animate-fade-in-up border-2 relative overflow-hidden" style={{
          backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(96, 165, 250, 0.1)',
          borderColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
        }}>
          <div className="flex gap-3 items-start relative z-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
              backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
            }}>
              <HelpCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-sm mb-2 uppercase tracking-wide text-blue-600">
                {t('explanation')}
              </p>
              <p className="text-base leading-relaxed" style={{
                color: 'var(--color-text-secondary)'
              }}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end relative z-10">
        <button
          onClick={handleNext}
          disabled={!isSubmitted}
          className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 flex items-center gap-2 btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white"
          style={{
            background: isSubmitted
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'var(--color-border)',
          }}
        >
          {currentNumber === totalQuestions ? t('finishQuiz') : t('nextQuestion')}
          <ArrowRight size={20} className={isSubmitted ? "animate-pulse" : ""} />
        </button>
      </div>
    </div>
  );
};

export default QuizCard;