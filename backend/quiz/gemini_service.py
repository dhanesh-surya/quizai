"""
Quiz generation service using Google Gemini AI
"""
import google.generativeai as genai
from django.conf import settings
import json
import re

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


def generate_quiz_questions(topic: str, difficulty: str, count: int, language: str = 'en') -> list:
    """
    Generate quiz questions using Gemini AI
    
    Args:
        topic: The topic for the quiz
        difficulty: Easy, Medium, or Hard
        count: Number of questions to generate (1-100)
        language: 'en' for English or 'hi' for Hindi
    
    Returns:
        List of question dictionaries with format:
        {
            'question': str,
            'options': [str, str, str, str],
            'correct_index': int (0-3),
            'explanation': str
        }
    """
    
    # Language-specific prompts
    if language == 'hi':
        prompt = f"""Create {count} multiple choice questions about "{topic}" for {difficulty} difficulty level in Hindi language.

For each question, provide:
1. Question text in Hindi
2. Four options (A, B, C, D) in Hindi
3. The index of the correct answer (0, 1, 2, or 3)
4. A brief explanation in Hindi

Format your response as a JSON array like this:
[
  {{
    "question": "प्रश्न यहाँ",
    "options": ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"],
    "correct_index": 0,
    "explanation": "व्याख्या यहाँ"
  }}
]

Generate exactly {count} questions."""
    else:
        prompt = f"""Create {count} multiple choice questions about "{topic}" for {difficulty} difficulty level.

For each question, provide:
1. Question text
2. Four options (A, B, C, D)
3. The index of the correct answer (0, 1, 2, or 3)
4. A brief explanation

Format your response as a JSON array like this:
[
  {{
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Explanation here"
  }}
]

Generate exactly {count} questions. Make sure the JSON is valid and properly formatted."""

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Try to find JSON array in the response
        json_match = re.search(r'\[\s*\{.*\}\s*\]', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
        else:
            # Try to clean up the response
            json_str = response_text
            if not json_str.startswith('['):
                json_str = '[' + json_str
            if not json_str.endswith(']'):
                json_str = json_str + ']'
        
        # Parse JSON
        questions = json.loads(json_str)
        
        # Validate questions
        validated_questions = []
        for q in questions[:count]:  # Ensure we don't exceed requested count
            if all(key in q for key in ['question', 'options', 'correct_index', 'explanation']):
                if len(q['options']) == 4 and 0 <= q['correct_index'] <= 3:
                    validated_questions.append(q)
        
        if len(validated_questions) < count:
            raise ValueError(f"Only generated {len(validated_questions)} valid questions out of {count}")
        
        return validated_questions[:count]
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error generating quiz: {str(e)}")
