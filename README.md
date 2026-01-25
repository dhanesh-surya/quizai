# 🚀 MindSpark AI Quiz - Full Stack Application

> A modern, full-stack quiz application with AI-powered question generation, beautiful UI with dark mode, and comprehensive backend data persistence.

## ✨ Features

### Frontend (React + TypeScript + Tailwind CSS)
- 🎨 **Modern UI Design** - Beautiful gradient-based interface
- 🌓 **Dark Mode** - Full dark/light theme support with persistence
- 🌍 **Multi-language** - English and Hindi support
- 📱 **Responsive Design** - Works perfectly on all devices
- ✨ **Smooth Animations** - Polished transitions and micro-interactions
- 🎯 **Quiz Generation** - AI-powered questions on any topic
- 📊 **Real-time Feedback** - Instant answer validation with explanations
- 🏆 **Results & Analytics** - Detailed performance tracking
- 📤 **Share Results** - Native share functionality

### Backend (Django + PostgreSQL/SQLite)
- 🔐 **Token Authentication** - Secure user authentication
- 💾 **Data Persistence** - All quizzes and results saved to database
- 🤖 **AI Integration** - Gemini AI for quiz generation
- 📊 **Admin Dashboard** - Comprehensive analytics and management
- 🎓 **User Profiles** - Track quiz history and statistics
- 🔒 **Role-based Access** - Admin and regular user roles
- 📡 **REST API** - Complete RESTful API with Django REST Framework

## 🏗️ Architecture

```
mindspark-ai-quiz/
├── frontend/ (React App)
│   ├── components/      # React components
│   ├── contexts/        # Theme & Language contexts
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   └── index.css        # Global styles with dark mode
│
└── backend/ (Django API)
    ├── mindspark_backend/  # Django project settings
    ├── quiz/               # Quiz app
    │   ├── models.py       # Database models
    │   ├── views.py        # API views
    │   ├── serializers.py  # DRF serializers
    │   ├── admin.py        # Admin interface
    │   └── gemini_service.py  # AI quiz generation
    └── manage.py           # Django management
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- pip

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mindspark-ai-quiz
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env and add your GEMINI_API_KEY

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver 8000
```

Backend will run at `http://localhost:8000`

### 3. Setup Frontend

```bash
# In a new terminal
cd mindspark-ai-quiz

# Install dependencies
npm install

# Configure environment
# Edit .env.local and add your GEMINI_API_KEY
# (Note: Frontend can work with or without backend)

# Start frontend dev server
npm run dev
```

Frontend will run at `http://localhost:3000`

## 🔧 Configuration

### Frontend Environment (.env.local)
```env
GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_API_URL=http://localhost:8000/api
```

### Backend Environment (.env)
```env
DJANGO_SECRET_KEY=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 📡 API Integration

The frontend can work in two modes:

### 1. With Backend (Recommended for Production)
- All data persists in database
- User authentication via Django
- Admin dashboard available
- Quiz history saved per user

Update `services/api.ts` to call Django API endpoints.

### 2. Standalone (Current Implementation)
- Uses localStorage for data
- No backend required
- Direct Gemini AI integration
- Perfect for quick testing

## 🎯 Key Improvements Made

### UI Redesign
✅ Complete modern redesign with Tailwind CSS
✅ Dark mode toggle with theme persistence
✅ Gradient backgrounds and glassmorphism
✅ Smooth animations and transitions
✅ Circular progress indicators
✅ Enhanced result cards with performance badges
✅ Share functionality
✅ Mobile-responsive design

### Functionality Fixes
✅ Fixed "+New Quiz" button to properly reset state
✅ Quiz state management improved
✅ Error handling enhanced

### Backend Implementation
✅ Complete Django REST API setup
✅ User authentication with tokens
✅ Quiz and question models
✅ Quiz attempt tracking
✅ User profiles with statistics
✅ Admin dashboard with analytics
✅ Role-based access control
✅ Comprehensive admin interface

## 🎨 Features Deep Dive

### Dark Mode
- System preference detection
- Manual toggle in navbar
- Persistent across sessions
- Smooth theme transitions
- All components theme-aware

### Quiz Generation
1. User enters topic, difficulty, question count
2. AI generates questions via Gemini API
3. Questions saved to database (if backend enabled)
4. Interactive quiz interface with animations

### Results & Analytics
- Pie chart visualization
- Performance badges
- Detailed statistics
- Quiz history tracking
- Share functionality
- Certificate generation

### Admin Features
- View all users and quizzes
- Analytics dashboard
- Quiz attempt monitoring
- User management
- Top performers leaderboard

## 📊 Database Schema

### Models
- **User** - Django auth user
- **UserProfile** - Extended user info & stats
- **Quiz** - Generated quizzes
- **Question** - Quiz questions with options
- **QuizAttempt** - User quiz submissions
- **UserAnswer** - Individual question answers

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns authentication token
3. Frontend stores token
4. Token included in all API requests
5. Backend validates and authorizes

## 📱 Screenshots

[Add screenshots of your application here]

## 🛠️ Tech Stack

### Frontend
- React 19+
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons
- Recharts
- Google Gemini AI

### Backend
- Django 5.0
- Django REST Framework
- SQLite/PostgreSQL
- Google Gemini AI
- Token Authentication

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- [Frontend UI Redesign](REDESIGN_SUMMARY.md)

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
# Configure production settings
# Set DEBUG=False
# Add production domain to ALLOWED_HOSTS
# Use PostgreSQL database
# Deploy with Gunicorn
gunicorn mindspark_backend.wsgi:application
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- Google Gemini AI for question generation
- Django & Django REST Framework teams
- React & Vite teams
- Tailwind CSS
- All open-source contributors

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check documentation
- Review API endpoints

---

**Made with ❤️ by MindSpark Team**

🌟 Don't forget to star this repo if you found it helpful!
