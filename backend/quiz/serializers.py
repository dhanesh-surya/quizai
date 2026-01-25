from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quiz, Question, QuizAttempt, UserAnswer, UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'is_admin', 'avatar', 'total_quizzes_taken', 
                  'average_score', 'best_score']
        read_only_fields = ['id', 'username', 'email', 'total_quizzes_taken', 
                             'average_score', 'best_score']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)
    avatar = serializers.ImageField(required=False, write_only=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'email', 'password', 'avatar']
        
    def update(self, instance, validated_data):
        # Extract avatar if present
        avatar = validated_data.pop('avatar', None)
            
        # Update User fields
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        
        # Update Profile avatar if provided
        if avatar is not None:
            # Ensure profile exists
            profile, created = UserProfile.objects.get_or_create(user=instance)
            profile.avatar = avatar
            profile.save()
            
        return instance


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question model"""
    options = serializers.ListField(child=serializers.CharField(), read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'correct_option', 
                  'explanation', 'order', 'option_a', 'option_b', 'option_c', 'option_d']
        read_only_fields = ['id']


class QuizSerializer(serializers.ModelSerializer):
    """Serializer for Quiz model"""
    questions = QuestionSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    total_questions = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'user', 'username', 'topic', 'difficulty', 'language', 
                  'created_at', 'total_questions', 'questions']
        read_only_fields = ['id', 'user', 'username', 'created_at', 'total_questions']


class QuizCreateSerializer(serializers.Serializer):
    """Serializer for creating a new quiz"""
    topic = serializers.CharField(max_length=200)
    difficulty = serializers.ChoiceField(choices=['Easy', 'Medium', 'Hard'])
    count = serializers.IntegerField(min_value=3, max_value=20)
    language = serializers.ChoiceField(choices=['en', 'hi'], default='en')


class UserAnswerSerializer(serializers.ModelSerializer):
    """Serializer for UserAnswer model"""
    question_details = QuestionSerializer(source='question', read_only=True)
    
    class Meta:
        model = UserAnswer
        fields = ['id', 'question', 'question_details', 'selected_option', 'is_correct']
        read_only_fields = ['id', 'is_correct']


class QuizAttemptSerializer(serializers.ModelSerializer):
    """Serializer for QuizAttempt model"""
    username = serializers.CharField(source='user.username', read_only=True)
    quiz_topic = serializers.CharField(source='quiz.topic', read_only=True)
    quiz_difficulty = serializers.CharField(source='quiz.difficulty', read_only=True)
    answers = UserAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = ['id', 'user', 'username', 'quiz', 'quiz_topic', 'quiz_difficulty',
                  'score', 'total_questions', 'score_percentage', 'completed_at', 'answers']
        read_only_fields = ['id', 'user', 'username', 'quiz_topic', 'quiz_difficulty',
                             'completed_at']


class QuizSubmitSerializer(serializers.Serializer):
    """Serializer for submitting quiz answers"""
    quiz_id = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )
    # answers format: [{"question_id": 1, "selected_option": 2}, ...]


class RegisterSerializer(serializers.Serializer):
    """Serializer for user registration"""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    admin_code = serializers.CharField(required=False, allow_blank=True)
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def create(self, validated_data):
        admin_code = validated_data.pop('admin_code', None)
        user = User.objects.create_user(**validated_data)
        
        # Create user profile
        is_admin = admin_code == 'admin123'
        UserProfile.objects.create(user=user, is_admin=is_admin)
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
