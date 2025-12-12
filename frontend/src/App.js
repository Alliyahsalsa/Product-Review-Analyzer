import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Minus, Loader2, Send, List, MessageSquare } from 'lucide-react';
import './App.css';

function App() {
  const [reviewText, setReviewText] = useState('');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // API Base URL - sesuaikan dengan backend Anda
  const API_BASE_URL = 'http://localhost:5000';

  // Function untuk analyze review
  const analyzeReview = async () => {
    if (!reviewText.trim() || !productName.trim()) {
      setError('Please fill in both product name and review text');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: productName,
          review_text: reviewText
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze review');
      }

      const data = await response.json();
      setAnalysisResult(data);
      setReviewText('');
      setProductName('');
      
      if (showAllReviews) {
        fetchAllReviews();
      }
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the review');
    } finally {
      setLoading(false);
    }
  };

  // Function untuk fetch all reviews
  const fetchAllReviews = async () => {
    setLoadingReviews(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setAllReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching reviews');
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (showAllReviews) {
      fetchAllReviews();
    }
  }, [showAllReviews]);

  const getSentimentClass = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'sentiment-positive';
      case 'negative':
        return 'sentiment-negative';
      case 'neutral':
        return 'sentiment-neutral';
      default:
        return 'sentiment-default';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <TrendingUp size={20} />;
      case 'negative':
        return <TrendingDown size={20} />;
      case 'neutral':
        return <Minus size={20} />;
      default:
        return null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      analyzeReview();
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="title">Product Review Analyzer</h1>
          <p className="subtitle">AI-powered sentiment analysis and key insights extraction</p>
        </header>

        {/* Main Content */}
        <div className="main-grid">
          {/* Left Column - Input Form */}
          <div className="left-column">
            <div className="card">
              <h2 className="card-title">
                <MessageSquare size={24} />
                Submit Review
              </h2>

              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., iPhone 15 Pro"
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Review Text</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your product review here... (Press Ctrl+Enter to submit)"
                  rows="6"
                  className="form-textarea"
                  disabled={loading}
                  onKeyPress={handleKeyPress}
                />
              </div>

              <button
                onClick={analyzeReview}
                disabled={loading}
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Analyze Review
                  </>
                )}
              </button>

              {error && (
                <div className="error-box">
                  <AlertCircle size={20} />
                  <p>{error}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="btn btn-secondary"
            >
              <List size={20} />
              {showAllReviews ? 'Hide All Reviews' : 'View All Reviews'}
            </button>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="right-column">
            {analysisResult && (
              <div className="card">
                <h2 className="card-title">Analysis Results</h2>

                <div className="result-section">
                  <h3 className="result-label">Product</h3>
                  <p className="result-value">{analysisResult.product_name}</p>
                </div>

                <div className="result-section">
                  <h3 className="result-label">Sentiment</h3>
                  <div className={`sentiment-badge ${getSentimentClass(analysisResult.sentiment)}`}>
                    {getSentimentIcon(analysisResult.sentiment)}
                    <span>{analysisResult.sentiment}</span>
                  </div>
                  {analysisResult.confidence && (
                    <p className="confidence-text">
                      Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>

                {analysisResult.key_points && analysisResult.key_points.length > 0 && (
                  <div className="result-section">
                    <h3 className="result-label">Key Points</h3>
                    <ul className="key-points-list">
                      {analysisResult.key_points.map((point, index) => (
                        <li key={index} className="key-point-item">
                          <span className="key-point-number">{index + 1}</span>
                          <span className="key-point-text">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="result-section">
                  <h3 className="result-label">Original Review</h3>
                  <p className="review-text">{analysisResult.review_text}</p>
                </div>

                {analysisResult.timestamp && (
                  <p className="timestamp">
                    Analyzed on {new Date(analysisResult.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {!analysisResult && !showAllReviews && (
              <div className="card empty-state">
                <MessageSquare size={64} className="empty-icon" />
                <p>Submit a review to see the analysis results here</p>
              </div>
            )}
          </div>
        </div>

        {/* All Reviews Section */}
        {showAllReviews && (
          <div className="card reviews-section">
            <h2 className="card-title">
              <List size={24} />
              All Reviews ({allReviews.length})
            </h2>

            {loadingReviews ? (
              <div className="loading-container">
                <Loader2 size={32} className="spinner" />
              </div>
            ) : allReviews.length === 0 ? (
              <p className="empty-message">No reviews found</p>
            ) : (
              <div className="reviews-grid">
                {allReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <h3 className="review-product">{review.product_name}</h3>
                      <span className={`sentiment-badge small ${getSentimentClass(review.sentiment)}`}>
                        {review.sentiment}
                      </span>
                    </div>

                    <p className="review-text-preview">{review.review_text}</p>

                    {review.key_points && review.key_points.length > 0 && (
                      <div className="review-keypoints">
                        <p className="keypoints-label">Key Points:</p>
                        <ul className="keypoints-list-small">
                          {review.key_points.slice(0, 3).map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="review-timestamp">
                      {new Date(review.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;