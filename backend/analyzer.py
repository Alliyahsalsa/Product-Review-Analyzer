from transformers import pipeline
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Hugging Face sentiment analyzer
sentiment_analyzer = None
try:
    sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    print("✅ Sentiment analyzer loaded")
except Exception as e:
    print(f"⚠️  Sentiment analyzer error: {e}")

# Initialize Gemini
gemini_model = None
try:
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel('gemini-pro')
        print("✅ Gemini model loaded")
    else:
        print("⚠️  GEMINI_API_KEY not found in .env")
except Exception as e:
    print(f"⚠️  Gemini error: {e}")

def analyze_sentiment(text):
    """
    Analyze sentiment using Hugging Face transformers
    Returns: dict with sentiment and score
    """
    if sentiment_analyzer is None:
        return {
            'sentiment': 'neutral',
            'score': 0.5
        }
    
    try:
        result = sentiment_analyzer(text[:512])[0]  # Limit to 512 chars for model
        
        # Convert to our format
        label = result['label'].lower()
        score = result['score']
        
        # Map POSITIVE/NEGATIVE to positive/negative/neutral
        if label == 'positive' and score > 0.6:
            sentiment = 'positive'
        elif label == 'negative' and score > 0.6:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
            
        return {
            'sentiment': sentiment,
            'score': score
        }
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        return {
            'sentiment': 'neutral',
            'score': 0.5
        }

def extract_key_points(text):
    """
    Extract key points using Gemini AI
    Returns: list of key points
    """
    if gemini_model is None:
        return []
    
    try:
        prompt = f"""Analyze this product review and extract 3-5 key points in bullet format.
Be concise and focus on the most important aspects mentioned.

Review: {text}

Key Points:"""
        
        response = gemini_model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Parse response into list of key points
        # Remove leading/trailing whitespace and split by newlines
        lines = [line.strip() for line in response_text.split('\n') if line.strip()]
        
        # Remove bullet points, numbers, etc.
        key_points = []
        for line in lines:
            # Remove common bullet point markers: -, •, *, 1., 2., etc.
            cleaned = line.lstrip('•-*').strip()
            # Remove numbers and dots at start: "1. text" -> "text"
            if cleaned and cleaned[0].isdigit():
                cleaned = ''.join(cleaned.split('.', 1)[1:]).strip()
            
            if cleaned:
                key_points.append(cleaned)
        
        return key_points if key_points else []
        
    except Exception as e:
        print(f"Error in key points extraction: {e}")
        return []

def analyze_review(review_text):
    """
    Complete review analysis combining both AI services
    """
    sentiment_result = analyze_sentiment(review_text)
    key_points = extract_key_points(review_text)
    
    return {
        'sentiment': sentiment_result['sentiment'],
        'sentiment_score': sentiment_result['score'],
        'key_points': key_points
    }
