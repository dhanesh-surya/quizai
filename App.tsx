import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { GameState, Difficulty, QuizData, QuizResult, User, AppView } from './types';
import { generateQuiz } from './services/geminiService';
import { storageService } from './services/storageService';
import { apiService } from './services/apiService';
import QuizForm from './components/QuizForm';
import QuizCard from './components/QuizCard';
import ResultCard from './components/ResultCard';
import Certificate from './components/Certificate';
import AuthForm from './components/AuthForm';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
import QuizReview from './components/QuizReview'; // Newly imported
import AdminDashboard from './components/AdminDashboard';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const { language } = useLanguage();
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [useBackend, setUseBackend] = useState(true); // Toggle to use backend

  // Quiz State
  const [gameState, setGameState] = useState<GameState>('input');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Review State
  const [reviewData, setReviewData] = useState<any | null>(null);

  // Backend integration state
  const [currentQuizId, setCurrentQuizId] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Array<{ question_id: number; selected_option: number }>>([]);

  // Print State
  const [certificateData, setCertificateData] = useState<QuizResult | null>(null);

  // Load User on Mount
  useEffect(() => {
    const loadUser = async () => {
      if (useBackend) {
        try {
          const userData = await apiService.getCurrentUser();
          if (userData) {
            setUser({
              id: userData.id.toString(),
              name: userData.name,
              email: userData.email,
              password: '',
              role: userData.is_admin ? 'admin' : 'user',
              avatar: userData.avatar,
              history: []
            });
            setCurrentView('home');
          }
        } catch (error) {
          console.log('No active session, showing login');
        }
      } else {
        const currentUser = storageService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setCurrentView('home');
        }
      }
    };
    loadUser();
  }, [useBackend]);

  const handleLogin = async (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView(loggedInUser.role === 'admin' ? 'admin' : 'home');
  };

  const handleLogout = async () => {
    if (useBackend) {
      await apiService.logout();
    } else {
      storageService.logout();
    }
    setUser(null);
    setCurrentView('auth');
    setGameState('input');
    setQuizData(null);
  };

  const fetchHistory = async () => {
    if (!user || !useBackend) return;

    try {
      const historyData = await apiService.getQuizHistory();
      // Map backend data to QuizResult[]
      const mappedHistory: QuizResult[] = historyData.map((item: any) => ({
        id: item.id.toString(),
        topic: item.quiz_topic,
        difficulty: item.quiz_difficulty,
        scorePercentage: item.score_percentage,
        date: new Date(item.completed_at).toLocaleDateString(),
        totalQuestions: item.total_questions,
        correctAnswers: item.score,
        details: item.answers // Store full answers for review
      }));

      setUser(prev => prev ? { ...prev, history: mappedHistory } : null);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleReview = (result: QuizResult) => {
    if (!result.details) return;

    // Transform to review format
    const reviewItems = result.details.map((answer: any) => ({
      question: {
        id: answer.question_details.id,
        question: answer.question_details.question_text,
        options: answer.question_details.options,
        correctIndex: answer.question_details.correct_option,
        explanation: answer.question_details.explanation
      },
      selectedOption: answer.selected_option,
      isCorrect: answer.is_correct
    }));

    setReviewData({
      topic: result.topic,
      date: result.date,
      scorePercentage: result.scorePercentage,
      items: reviewItems
    });
    setCurrentView('review' as AppView);
  };

  const handleGenerateQuiz = async (topic: string, difficulty: Difficulty, count: number) => {
    setGameState('loading');
    setError(null);
    setUserAnswers([]); // Reset user answers

    try {
      if (useBackend) {
        // Use backend API
        const response = await apiService.generateQuiz({
          topic,
          difficulty,
          count,
          language
        });

        // Transform backend response to frontend format
        const transformedQuiz: QuizData = {
          topic: response.topic,
          difficulty: response.difficulty,
          questions: response.questions.map((q: any) => ({
            id: q.id,
            question: q.question_text,
            options: q.options,
            correctIndex: q.correct_option,
            explanation: q.explanation
          }))
        };

        setQuizData(transformedQuiz);
        setCurrentQuizId(response.id);
      } else {
        // Use local generation
        const data = await generateQuiz(topic, difficulty, count, language);
        setQuizData(data);
      }

      setCurrentQuestionIndex(0);
      setScore(0);
      setGameState('quiz');
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz');
      setGameState('input');
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        finishQuiz(isCorrect);
      }, 500);
    }
  };

  // New function to handle answer with selected option
  const handleAnswerWithOption = (selectedOption: number, isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Track user answer for backend submission
    if (useBackend && quizData) {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      setUserAnswers(prev => [...prev, {
        question_id: currentQuestion.id,
        selected_option: selectedOption
      }]);
    }

    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        finishQuiz(isCorrect, selectedOption);
      }, 500);
    }
  };

  const finishQuiz = async (lastAnswerCorrect: boolean, lastSelectedOption?: number) => {
    if (!quizData || !user) return;

    // Calculate final score including the last answer
    const finalScore = lastAnswerCorrect ? score + 1 : score;

    // Add last answer to tracking if using backend
    if (useBackend && lastSelectedOption !== undefined) {
      const lastQuestion = quizData.questions[currentQuestionIndex];
      const allAnswers = [...userAnswers, {
        question_id: lastQuestion.id,
        selected_option: lastSelectedOption
      }];

      // Submit to backend
      try {
        if (currentQuizId) {
          const response = await apiService.submitQuiz(currentQuizId, allAnswers);

          const result: QuizResult = {
            id: response.id.toString(),
            totalQuestions: response.total_questions,
            correctAnswers: response.score,
            scorePercentage: response.score_percentage,
            topic: quizData.topic,
            difficulty: quizData.difficulty,
            date: new Date(response.completed_at).toLocaleDateString(),
            language: language,
            details: response.answers // Store for immediate review
          };

          setScore(finalScore);
          setCertificateData(result);
          setGameState('result');
          return;
        }
      } catch (error) {
        console.error('Failed to submit quiz to backend:', error);
        // Fall through to local storage
      }
    }

    // Local storage fallback or non-backend mode
    const result: QuizResult = {
      id: crypto.randomUUID(),
      totalQuestions: quizData.questions.length,
      correctAnswers: finalScore,
      scorePercentage: Math.round((finalScore / quizData.questions.length) * 100),
      topic: quizData.topic,
      difficulty: quizData.difficulty,
      date: new Date().toLocaleDateString(),
      language: language
    };

    // Save to Storage (if not using backend)
    if (!useBackend) {
      const updatedUser = storageService.addQuizResult(user.id, result);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }

    setScore(finalScore);
    setCertificateData(result);
    setGameState('result');
  };

  const handleRetry = () => {
    setGameState('input');
    setQuizData(null);
    setScore(0);
    setCurrentQuestionIndex(0);
    setCertificateData(null);
  };

  // Open certificate in new tab for preview/printing
  const handleDownloadCertificate = (result: QuizResult) => {
    if (!user) return;

    // Generate Static HTML for the certificate
    const certificateHtml = ReactDOMServer.renderToStaticMarkup(
      <Certificate result={result} userName={user.name} />
    );

    // Get all style sheets from current document to ensure styling is preserved
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('');

    // Open new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${result.topic}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            ${styles}
            <style>
              body { margin: 0; padding: 0; background-color: #f3f4f6; }
              @media print {
                 @page { size: landscape; margin: 0; }
                 body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${certificateHtml}
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user || currentView === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        backgroundColor: 'var(--color-bg-primary)'
      }}>
        <AuthForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-800" style={{
      backgroundColor: 'var(--color-bg-primary)',
      color: 'var(--color-text-primary)'
    }}>

      {/* Navigation */}
      <Navbar
        user={user}
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          setReviewData(null);
          // Set view to profile and fetch history
          if (view === 'profile' && useBackend && user) {
            fetchHistory();
          }

          // Reset game state when clicking New Quiz or navigating
          if (view === 'home') {
            // Reset to input state for new quiz
            setGameState('input');
            setQuizData(null);
            setScore(0);
            setCurrentQuestionIndex(0);
            setError(null);
            setCertificateData(null);
          } else if (view !== 'home') {
            setGameState('input');
          }
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="no-print min-h-[calc(100vh-64px)] flex flex-col items-center p-4 sm:p-6">

        {/* Error Notification */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md w-full text-center animate-fade-in-down">
            {error}
          </div>
        )}

        {/* View: Home (Quiz Generator) */}
        {currentView === 'home' && (
          <>
            {gameState === 'input' && (
              <QuizForm
                onGenerate={handleGenerateQuiz}
                isLoading={false}
              />
            )}

            {gameState === 'loading' && (
              <QuizForm
                onGenerate={() => { }}
                isLoading={true}
              />
            )}

            {gameState === 'quiz' && quizData && (
              <QuizCard
                question={quizData.questions[currentQuestionIndex]}
                currentNumber={currentQuestionIndex + 1}
                totalQuestions={quizData.questions.length}
                onAnswer={handleAnswerWithOption}
              />
            )}

            {gameState === 'result' && certificateData && (
              <ResultCard
                result={certificateData}
                onRetry={handleRetry}
                onDownload={() => handleDownloadCertificate(certificateData)}
              />
            )}
          </>
        )}

        {/* View: Profile */}
        {currentView === 'profile' && (
          <UserProfile
            user={user}
            onDownloadCertificate={handleDownloadCertificate}
            onReview={handleReview}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {/* View: Review */}
        {currentView === ('review' as AppView) && reviewData && (
          <QuizReview
            topic={reviewData.topic}
            date={reviewData.date}
            scorePercentage={reviewData.scorePercentage}
            items={reviewData.items}
            onBack={() => {
              setReviewData(null);
              setCurrentView('profile');
            }}
          />
        )}

        {/* View: Admin */}
        {currentView === 'admin' && (
          <AdminDashboard />
        )}

      </main>
    </div>
  );
};

export default App;