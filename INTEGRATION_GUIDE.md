# Frontend Integration Guide

## Overview

This guide explains how to integrate the React frontend with the Django backend API to enable data persistence and user account management.

## Current Status

✅ **Completed:**
- Django backend fully implemented
- REST API endpoints created
- Database models set up
- Admin dashboard configured
- UI redesigned with dark mode

🔄 **Next Step:**
- Update React frontend to use Django API instead of localStorage

## Integration Steps

### Step 1: Create API Service

Create a new file `services/apiService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api';

class APIService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Token ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async register(data: { username: string; email: string; password: string; first_name?: string; admin_code?: string }) {
    const response = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async logout() {
    await this.request('/auth/logout/', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async getCurrentUser() {
    return this.request('/auth/me/');
  }

  // Quiz Operations
  async generateQuiz(data: { topic: string; difficulty: string; count: number; language: string }) {
    return this.request('/quiz/generate/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitQuiz(quizId: number, answers: Array<{ question_id: number; selected_option: number }>) {
    return this.request('/quiz/submit/', {
      method: 'POST',
      body: JSON.stringify({ quiz_id: quizId, answers }),
    });
  }

  async getMyQuizzes() {
    return this.request('/quizzes/my_quizzes/');
  }

  async getQuizHistory() {
    return this.request('/attempts/my_history/');
  }

  async getQuizStats() {
    return this.request('/attempts/stats/');
  }

  // Admin
  async getAdminDashboard() {
    return this.request('/admin/dashboard/');
  }
}

export const apiService = new APIService();
```

### Step 2: Update AuthForm Component

Replace localStorage calls with API calls:

```typescript
// In AuthForm.tsx

import { apiService } from '../services/apiService';

// In handleSubmit function:
if (isLogin) {
  const response = await apiService.login(email, password);
  onLogin({
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    password: '', // Don't store password
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
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    password: '',
    role: response.user.is_admin ? 'admin' : 'user',
    history: []
  });
}
```

### Step 3: Update Quiz Generation

In `App.tsx`, update `handleGenerateQuiz`:

```typescript
const handleGenerateQuiz = async (topic: string, difficulty: Difficulty, count: number) => {
  setGameState('loading');
  setError(null);
  try {
    const quizData = await apiService.generateQuiz({
      topic,
      difficulty,
      count,
      language
    });
    
    // Transform backend response to frontend format
    const transformedQuiz = {
      topic: quizData.topic,
      difficulty: quizData.difficulty,
      questions: quizData.questions.map((q: any, idx: number) => ({
        id: q.id,
        question: q.question_text,
        options: q.options,
        correctIndex: q.correct_option,
        explanation: q.explanation
      }))
    };
    
    setQuizData(transformedQuiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('quiz');
  } catch (err: any) {
    setError(err.message || 'Failed to generate quiz');
    setGameState('input');
  }
};
```

### Step 4: Update Quiz Submission

Add a new function to submit quiz results:

```typescript
const handleQuizComplete = async (finalScore: number) => {
  if (!quizData || !user) return;
  
  try {
    // Prepare answers for submission
    const answers = quizData.questions.map((q, idx) => ({
      question_id: q.id,
      selected_option: userAnswers[idx] // You'll need to track user answers
    }));
    
    const result = await apiService.submitQuiz(currentQuizId, answers);
    
    // Convert to frontend format
    const quizResult: QuizResult = {
      id: result.id.toString(),
      totalQuestions: result.total_questions,
      correctAnswers: result.score,
      scorePercentage: result.score_percentage,
      topic: result.quiz_topic,
      difficulty: result.quiz_difficulty,
      date: new Date(result.completed_at).toLocaleDateString(),
      language: language
    };
    
    setCertificateData(quizResult);
    setGameState('result');
  } catch (err) {
    console.error('Failed to submit quiz:', err);
  }
};
```

### Step 5: Update UserProfile Component

Load quiz history from backend:

```typescript
// In UserProfile.tsx
import { apiService } from '../services/apiService';

const [quizHistory, setQuizHistory] = useState([]);
const [stats, setStats] = useState(null);

useEffect(() => {
  const loadHistory = async () => {
    try {
      const [history, statistics] = await Promise.all([
        apiService.getQuizHistory(),
        apiService.getQuizStats()
      ]);
      setQuizHistory(history);
      setStats(statistics);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };
  
  loadHistory();
}, []);
```

### Step 6: Update AdminDashboard Component

```typescript
// In AdminDashboard.tsx
import { apiService } from '../services/apiService';

const [dashboardData, setDashboardData] = useState(null);

useEffect(() => {
  const loadDashboard = async () => {
    try {
      const data = await apiService.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };
  
  loadDashboard();
}, []);
```

### Step 7: Enable CORS

Make sure backend is running and CORS is properly configured (already done in Django settings).

### Step 8: Test Integration

1. Start Django backend: `cd backend && python manage.py runserver 8000`
2. Start React frontend: `npm run dev`
3. Test registration/login
4. Test quiz generation
5. Test quiz submission
6. Verify data persists in Django admin

## Benefits of Backend Integration

✅ **Data Persistence** - Quizzes and results saved permanently
✅ **User Accounts** - Separate accounts with personalized history
✅ **Admin Dashboard** - View all users and their performance
✅ **Centralized Data** - One source of truth
✅ **Scalability** - Can handle multiple users
✅ **Security** - Token-based authentication
✅ **Analytics** - Comprehensive statistics and insights

## Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Quiz generates from backend
- [ ] Quiz saves to database
- [ ] Quiz results save to database
- [ ] User can view quiz history
- [ ] Admin can view dashboard
- [ ] Theme persists across sessions
- [ ] "+New Quiz" button works correctly

## Troubleshooting

### CORS Errors
Ensure backend CORS settings include frontend URL:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Auth Token Not Working
Check that token is being saved to localStorage and included in requests:
```javascript
headers: {
  'Authorization': `Token ${token}`
}
```

### Quiz Not Saving
Check Django backend logs for errors:
```bash
python manage.py runserver 8000
# Watch console for errors
```

## Next Features to Add

1. **Real-time updates** - WebSocket for live quiz updates
2. **Social features** - Challenge friends, share results
3. **Advanced analytics** - Performance trends over time
4. **Quiz categories** - Organize quizzes by subject
5. **Time limits** - Timed quizzes for extra challenge
6. **Achievements** - Badges and rewards system

---

**Note:** The current implementation uses localStorage and works standalone. Backend integration is optional but recommended for production use with multiple users.
