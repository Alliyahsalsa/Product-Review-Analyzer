from flask import Flask, request, jsonify
from flask_cors import CORS
from models import SessionLocal, Review
from analyzer import analyze_review
import traceback
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/api/analyze-review', methods=['POST'])
def analyze_review_endpoint():
    """
    POST /api/analyze-review
    Body: { "review_text": "..." }
    """
    try:
        data = request.get_json()
        
        if not data or 'review_text' not in data:
            return jsonify({'error': 'review_text is required'}), 400
        
        review_text = data['review_text'].strip()
        
        if not review_text:
            return jsonify({'error': 'review_text cannot be empty'}), 400
        
        if len(review_text) < 10:
            return jsonify({'error': 'review_text must be at least 10 characters'}), 400
        
        # Analyze the review
        print(f"Analyzing review: {review_text[:50]}...")
        analysis = analyze_review(review_text)
        
        # Save to database
        db = SessionLocal()
        try:
            new_review = Review(
                review_text=review_text,
                sentiment=analysis['sentiment'],
                sentiment_score=analysis['sentiment_score'],
                key_points=json.dumps(analysis['key_points'])  # Convert list to JSON string
            )
            db.add(new_review)
            db.commit()
            db.refresh(new_review)
            
            result = new_review.to_dict()
            return jsonify(result), 201
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"Error: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    """
    GET /api/reviews
    Returns all reviews from database
    """
    try:
        db = SessionLocal()
        try:
            reviews = db.query(Review).order_by(Review.created_at.desc()).all()
            return jsonify({'reviews': [review.to_dict() for review in reviews]}), 200
        finally:
            db.close()
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)