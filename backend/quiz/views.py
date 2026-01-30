from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Avg, Max
from django.http import HttpResponse

from .models import Quiz, Question, QuizAttempt, UserAnswer, UserProfile, SiteTheme
from .gemini_service import generate_quiz_questions
import logging

logger = logging.getLogger(__name__)

def landing_page(request):
    """Show landing page or redirect to dashboard if authenticated"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    return render(request, 'quiz/landing.html')

def register_view(request):
    """Handle user registration"""
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password != confirm_password:
            messages.error(request, "Passwords do not match!")
            return render(request, 'quiz/register.html')
        
        try:
            from django.contrib.auth.models import User
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists")
                return render(request, 'quiz/register.html')
            
            if User.objects.filter(email=email).exists():
                messages.error(request, "Email already exists")
                return render(request, 'quiz/register.html')

            user = User.objects.create_user(username=username, email=email, password=password)
            # UserProfile is automatically created by the post_save signal
            
            # Specify the backend explicitly since multiple backends are configured
            auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            messages.success(request, f"Welcome, {username}!")
            return redirect('dashboard')

        except Exception as e:
            messages.error(request, f"Registration failed: {str(e)}")
            return render(request, 'quiz/register.html')

    return render(request, 'quiz/register.html')

def login_view(request):
    """Handle user login"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    
    return render(request, 'quiz/login.html')

@login_required
def logout_view(request):
    """Handle user logout"""
    auth_logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('login')

@login_required
def dashboard_view(request):
    """Main dashboard for quiz generation"""
    return render(request, 'quiz/dashboard.html')

@login_required
def generate_quiz_view(request):
    """Handle quiz generation"""
    if request.method == 'POST':
        topic = request.POST.get('topic')
        difficulty = request.POST.get('difficulty')
        count = int(request.POST.get('count', 5))
        language = request.POST.get('language', 'en')

        try:
            # Generate questions using Gemini AI
            questions_data = generate_quiz_questions(topic, difficulty, count, language)
            
            # Create quiz
            quiz = Quiz.objects.create(
                user=request.user,
                topic=topic,
                difficulty=difficulty,
                language=language
            )
            
            # Create questions
            for idx, q_data in enumerate(questions_data):
                Question.objects.create(
                    quiz=quiz,
                    question_text=q_data['question'],
                    option_a=q_data['options'][0],
                    option_b=q_data['options'][1],
                    option_c=q_data['options'][2],
                    option_d=q_data['options'][3],
                    correct_option=q_data['correct_index'],
                    explanation=q_data['explanation'],
                    order=idx + 1
                )
            
            return redirect('take_quiz', quiz_id=quiz.id)

        except Exception as e:
            logger.error(f"Error generating quiz: {str(e)}")
            messages.error(request, f"Failed to generate quiz: {str(e)}")
            return redirect('dashboard')

    return redirect('dashboard')

@login_required
def take_quiz_view(request, quiz_id):
    """Render the quiz taking page"""
    quiz = get_object_or_404(Quiz, id=quiz_id, user=request.user)
    return render(request, 'quiz/take_quiz.html', {'quiz': quiz})

@login_required
def submit_quiz_view(request, quiz_id):
    """Handle quiz submission"""
    quiz = get_object_or_404(Quiz, id=quiz_id, user=request.user)
    
    if request.method == 'POST':
        correct_count = 0
        total_questions = quiz.questions.count()
        
        # Create attempt
        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=0,
            total_questions=total_questions,
            score_percentage=0
        )
        
        # Check answers
        for question in quiz.questions.all():
            selected_option_index = request.POST.get(f'question_{question.id}')
            
            if selected_option_index is not None:
                selected_option = int(selected_option_index)
                is_correct = (selected_option == question.correct_option)
                
                if is_correct:
                    correct_count += 1
                
                UserAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_option=selected_option,
                    is_correct=is_correct
                )
            else:
                # Handle unanswered questions (optional, currently treating as wrong)
                UserAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_option=-1, # -1 for no selection
                    is_correct=False
                )

        # Update scores
        score_percentage = int((correct_count / total_questions) * 100) if total_questions > 0 else 0
        attempt.score = correct_count
        attempt.score_percentage = score_percentage
        attempt.save()

        # Update profile stats
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.update_stats()

        return redirect('quiz_result', attempt_id=attempt.id)

    return redirect('dashboard')

@login_required
def result_view(request, attempt_id):
    """Show quiz results"""
    attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
    answers = attempt.answers.select_related('question').all()
    
    return render(request, 'quiz/result.html', {
        'attempt': attempt,
        'answers': answers,
        'score': attempt.score,
        'total_questions': attempt.total_questions
    })

@login_required
def certificate_view(request, attempt_id):
    """Render a printable certificate"""
    attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
    return render(request, 'quiz/certificate.html', {
        'attempt': attempt,
        'final_score': attempt.score_percentage
    })

@login_required
def profile_view(request):
    """User profile and history"""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    history = QuizAttempt.objects.filter(user=request.user).select_related('quiz').order_by('-completed_at')
    
    return render(request, 'quiz/profile.html', {
        'profile': profile,
        'history': history,
        'user': request.user
    })

@login_required
def edit_profile_view(request):
    """Edit user profile"""
    if request.method == 'POST':
        user = request.user
        user.first_name = request.POST.get('name', user.first_name)
        user.email = request.POST.get('email', user.email)
        
        # Handle password change if provided
        new_password = request.POST.get('password')
        if new_password:
             user.set_password(new_password)
             auth_login(request, user) # Keep user logged in
        
        # Handle Avatar Upload
        if 'avatar' in request.FILES:
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.avatar = request.FILES['avatar']
            profile.save()
            
        user.save()
        messages.success(request, "Profile updated successfully!")
        return redirect('profile')

    return render(request, 'quiz/edit_profile.html', {'user': request.user})

@login_required
def admin_dashboard_view(request):
    """Admin dashboard stats"""
    if not hasattr(request.user, 'profile') or not request.user.profile.is_admin:
        messages.error(request, "Access denied.")
        return redirect('dashboard')

    from django.contrib.auth.models import User
    
    total_users = User.objects.count()
    total_quizzes = Quiz.objects.count()
    total_attempts = QuizAttempt.objects.count()
    
    recent_attempts = QuizAttempt.objects.select_related('user', 'quiz').order_by('-completed_at')[:10]
    top_performers = UserProfile.objects.select_related('user').order_by('-best_score')[:10]

    return render(request, 'quiz/admin_dashboard.html', {
        'total_users': total_users,
        'total_quizzes': total_quizzes,
        'total_attempts': total_attempts,
        'recent_attempts': recent_attempts,
        'top_performers': top_performers
    })


# Theme Management Views

@login_required
def theme_list(request):
    """List all themes"""
    if not request.user.profile.is_admin:
        messages.error(request, "You don't have permission to access theme management.")
        return redirect('dashboard')
    
    themes = SiteTheme.objects.all()
    active_theme = SiteTheme.get_active_theme()
    
    return render(request, 'quiz/theme_list.html', {
        'themes': themes,
        'active_theme': active_theme
    })


@login_required
def theme_create(request):
    """Create a new theme"""
    if not request.user.profile.is_admin:
        messages.error(request, "You don't have permission to create themes.")
        return redirect('dashboard')
    
    from .forms import ThemeCustomizationForm
    
    if request.method == 'POST':
        form = ThemeCustomizationForm(request.POST, request.FILES)
        if form.is_valid():
            theme = form.save(commit=False)
            theme.created_by = request.user
            theme.save()
            messages.success(request, f"Theme '{theme.name}' created successfully!")
            return redirect('theme_list')
    else:
        form = ThemeCustomizationForm()
    
    return render(request, 'quiz/theme_form.html', {
        'form': form,
        'title': 'Create New Theme',
        'button_text': 'Create Theme'
    })


@login_required
def theme_edit(request, theme_id):
    """Edit an existing theme"""
    if not request.user.profile.is_admin:
        messages.error(request, "You don't have permission to edit themes.")
        return redirect('dashboard')
    
    from .forms import ThemeCustomizationForm
    theme = get_object_or_404(SiteTheme, pk=theme_id)
    
    if request.method == 'POST':
        form = ThemeCustomizationForm(request.POST, request.FILES, instance=theme)
        if form.is_valid():
            form.save()
            messages.success(request, f"Theme '{theme.name}' updated successfully!")
            return redirect('theme_list')
    else:
        form = ThemeCustomizationForm(instance=theme)
    
    return render(request, 'quiz/theme_form.html', {
        'form': form,
        'theme': theme,
        'title': f'Edit Theme: {theme.name}',
        'button_text': 'Update Theme'
    })


@login_required
def theme_delete(request, theme_id):
    """Delete a theme"""
    if not request.user.profile.is_admin:
        messages.error(request, "You don't have permission to delete themes.")
        return redirect('dashboard')
    
    theme = get_object_or_404(SiteTheme, pk=theme_id)
    
    if theme.is_active:
        messages.error(request, "Cannot delete the active theme. Please activate another theme first.")
        return redirect('theme_list')
    
    theme_name = theme.name
    theme.delete()
    messages.success(request, f"Theme '{theme_name}' deleted successfully!")
    return redirect('theme_list')


@login_required
def theme_activate(request, theme_id):
    """Activate a theme"""
    if not request.user.profile.is_admin:
        messages.error(request, "You don't have permission to activate themes.")
        return redirect('dashboard')
    
    theme = get_object_or_404(SiteTheme, pk=theme_id)
    theme.is_active = True
    theme.save()  # This will automatically deactivate other themes
    
    messages.success(request, f"Theme '{theme.name}' is now active!")
    return redirect('theme_list')


@login_required
def theme_preview(request, theme_id):
    """Preview a theme without activating it"""
    theme = get_object_or_404(SiteTheme, pk=theme_id)
    
    return render(request, 'quiz/theme_preview.html', {
        'theme': theme,
        'preview_mode': True
    })
