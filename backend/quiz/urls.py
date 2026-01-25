from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'quizzes', views.QuizViewSet, basename='quiz')
router.register(r'attempts', views.QuizAttemptViewSet, basename='attempt')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/me/', views.current_user, name='current_user'),
    path('auth/update-profile/', views.update_profile, name='update_profile'),
    
    # Quiz endpoints
    path('quiz/generate/', views.generate_quiz, name='generate_quiz'),
    path('quiz/submit/', views.submit_quiz, name='submit_quiz'),
    
    # Admin endpoint
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    
    # Router URLs (quizzes, attempts with their viewsets)
    path('', include(router.urls)),
]
