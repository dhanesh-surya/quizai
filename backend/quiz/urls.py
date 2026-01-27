from django.urls import path
from . import views

urlpatterns = [
    # Auth Views
    path('', views.landing_page, name='landing'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # App Views
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('generate/', views.generate_quiz_view, name='generate_quiz'),
    path('take/<int:quiz_id>/', views.take_quiz_view, name='take_quiz'),
    path('submit/<int:quiz_id>/', views.submit_quiz_view, name='quiz_submit'),
    path('result/<int:attempt_id>/', views.result_view, name='quiz_result'),
    path('certificate/<int:attempt_id>/', views.certificate_view, name='certificate'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/edit/', views.edit_profile_view, name='edit_profile'),
    path('admin-dashboard/', views.admin_dashboard_view, name='admin_dashboard'),
    
    # Theme Management
    path('themes/', views.theme_list, name='theme_list'),
    path('themes/create/', views.theme_create, name='theme_create'),
    path('themes/<int:theme_id>/edit/', views.theme_edit, name='theme_edit'),
    path('themes/<int:theme_id>/delete/', views.theme_delete, name='theme_delete'),
    path('themes/<int:theme_id>/activate/', views.theme_activate, name='theme_activate'),
    path('themes/<int:theme_id>/preview/', views.theme_preview, name='theme_preview'),
]
