from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Quiz, Question, QuizAttempt, UserAnswer, UserProfile
from .serializers import (
    QuizSerializer, QuestionSerializer, QuizAttemptSerializer,
    UserAnswerSerializer, QuizCreateSerializer, QuizSubmitSerializer,
    RegisterSerializer, LoginSerializer, UserProfileSerializer, UserUpdateSerializer
)
from .gemini_service import generate_quiz_questions
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        profile = user.profile
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.first_name or user.username,
                'avatar': profile.avatar.url if profile.avatar else None,
                'is_admin': profile.is_admin
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
            user = authenticate(username=user.username, password=password)
            
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                profile, _ = UserProfile.objects.get_or_create(user=user)
                
                return Response({
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'name': user.first_name or user.username,
                        'avatar': profile.avatar.url if profile.avatar else None,
                        'is_admin': profile.is_admin
                    }
                })
            
        except User.DoesNotExist:
            pass
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user"""
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current logged-in user info"""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    profile.update_stats()
    
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'name': request.user.first_name or request.user.username,
        'avatar': profile.avatar.url if profile.avatar else None,
        'is_admin': profile.is_admin,
        'stats': {
            'total_quizzes_taken': profile.total_quizzes_taken,
            'average_score': round(profile.average_score, 1),
            'best_score': profile.best_score
        }
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        user = serializer.save()
        profile = user.profile
        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.first_name or user.username,
                'avatar': profile.avatar.url if profile.avatar else None,
                'is_admin': profile.is_admin
            }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    """Generate a new quiz using Gemini AI"""
    serializer = QuizCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        topic = serializer.validated_data['topic']
        difficulty = serializer.validated_data['difficulty']
        count = serializer.validated_data['count']
        language = serializer.validated_data.get('language', 'en')
        
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
            
            quiz_serializer = QuizSerializer(quiz)
            return Response(quiz_serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error generating quiz: {str(e)}")
            return Response(
                {'error': f'Failed to generate quiz: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request):
    """Submit quiz answers and calculate score"""
    serializer = QuizSubmitSerializer(data=request.data)
    
    if serializer.is_valid():
        quiz_id = serializer.validated_data['quiz_id']
        answers = serializer.validated_data['answers']
        
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Calculate score
        correct_count = 0
        total_questions = quiz.questions.count()
        
        # Create quiz attempt
        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            score=0,  # Will update
            total_questions=total_questions,
            score_percentage=0  # Will update
        )
        
        # Process each answer
        for answer_data in answers:
            question_id = answer_data['question_id']
            selected_option = answer_data['selected_option']
            
            try:
                question = quiz.questions.get(id=question_id)
                is_correct = question.correct_option == selected_option
                
                if is_correct:
                    correct_count += 1
                
                UserAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_option=selected_option,
                    is_correct=is_correct
                )
            except Question.DoesNotExist:
                continue
        
        # Update attempt with final score
        score_percentage = int((correct_count / total_questions) * 100) if total_questions > 0 else 0
        attempt.score = correct_count
        attempt.score_percentage = score_percentage
        attempt.save()
        
        # Update user profile stats
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.update_stats()
        
        attempt_serializer = QuizAttemptSerializer(attempt)
        return Response(attempt_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Quiz"""
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users see their own quizzes, admins see all
        if hasattr(self.request.user, 'profile') and self.request.user.profile.is_admin:
            return Quiz.objects.all()
        return Quiz.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_quizzes(self, request):
        """Get current user's quizzes"""
        quizzes = Quiz.objects.filter(user=request.user)
        serializer = self.get_serializer(quizzes, many=True)
        return Response(serializer.data)


class QuizAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for QuizAttempt"""
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Users see their own attempts, admins see all
        if hasattr(self.request.user, 'profile') and self.request.user.profile.is_admin:
            return QuizAttempt.objects.all()
        return QuizAttempt.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_history(self, request):
        """Get current user's quiz history"""
        attempts = QuizAttempt.objects.filter(user=request.user)
        serializer = self.get_serializer(attempts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get quiz statistics"""
        attempts = QuizAttempt.objects.filter(user=request.user)
        
        if not attempts.exists():
            return Response({
                'total_attempts': 0,
                'average_score': 0,
                'best_score': 0,
                'total_quizzes': 0
            })
        
        total_attempts = attempts.count()
        average_score = sum(a.score_percentage for a in attempts) / total_attempts
        best_score = max(a.score_percentage for a in attempts)
        total_quizzes = Quiz.objects.filter(user=request.user).count()
        
        return Response({
            'total_attempts': total_attempts,
            'average_score': round(average_score, 1),
            'best_score': best_score,
            'total_quizzes': total_quizzes
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    """Get admin dashboard statistics"""
    # Check if user is admin
    if not (hasattr(request.user, 'profile') and request.user.profile.is_admin):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    total_users = User.objects.count()
    total_quizzes = Quiz.objects.count()
    total_attempts = QuizAttempt.objects.count()
    
    # Recent quiz attempts
    recent_attempts = QuizAttempt.objects.all()[:10]
    recent_serializer = QuizAttemptSerializer(recent_attempts, many=True)
    
    # Top performers
    profiles = UserProfile.objects.order_by('-best_score')[:10]
    top_users = [{
        'username': p.user.username,
        'best_score': p.best_score,
        'average_score': round(p.average_score, 1),
        'total_quizzes': p.total_quizzes_taken
    } for p in profiles]
    
    return Response({
        'total_users': total_users,
        'total_quizzes': total_quizzes,
        'total_attempts': total_attempts,
        'recent_attempts': recent_serializer.data,
        'top_performers': top_users
    })
