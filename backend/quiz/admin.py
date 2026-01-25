from django.contrib import admin
from .models import Quiz, Question, QuizAttempt, UserAnswer, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_admin', 'total_quizzes_taken', 'average_score', 'best_score']
    list_filter = ['is_admin']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['total_quizzes_taken', 'average_score', 'best_score']


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0
    fields = ['order', 'question_text', 'correct_option']
    readonly_fields = ['order']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['topic', 'user', 'difficulty', 'language', 'total_questions', 'created_at']
    list_filter = ['difficulty', 'language', 'created_at']
    search_fields = ['topic', 'user__username']
    readonly_fields = ['created_at', 'total_questions']
    inlines = [QuestionInline]
    
    def total_questions(self, obj):
        return obj.questions.count()
    total_questions.short_description = 'Questions'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'order', 'question_text_short', 'correct_option']
    list_filter = ['quiz__difficulty', 'quiz__topic']
    search_fields = ['question_text', 'quiz__topic']
    
    def question_text_short(self, obj):
        return obj.question_text[:50] + '...' if len(obj.question_text) > 50 else obj.question_text
    question_text_short.short_description = 'Question'


class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    extra = 0
    readonly_fields = ['question', 'selected_option', 'is_correct']


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score_display', 'score_percentage', 'completed_at']
    list_filter = ['completed_at', 'quiz__difficulty']
    search_fields = ['user__username', 'quiz__topic']
    readonly_fields = ['completed_at']
    inlines = [UserAnswerInline]
    
    def score_display(self, obj):
        return f"{obj.score}/{obj.total_questions}"
    score_display.short_description = 'Score'


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt_user', 'question_short', 'selected_option', 'is_correct']
    list_filter = ['is_correct']
    search_fields = ['attempt__user__username', 'question__question_text']
    
    def attempt_user(self, obj):
        return obj.attempt.user.username
    attempt_user.short_description = 'User'
    
    def question_short(self, obj):
        return obj.question.question_text[:40] + '...'
    question_short.short_description = 'Question'
