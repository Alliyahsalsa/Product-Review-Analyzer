from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
import json
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    # default to local sqlite file
    DATABASE_URL = f"sqlite:///" + os.path.join(os.path.dirname(__file__), 'product_reviews.db')

# For sqlite use check_same_thread flag
if DATABASE_URL.startswith('sqlite'):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Review(Base):
    __tablename__ = 'reviews'
    
    id = Column(Integer, primary_key=True, index=True)
    review_text = Column(Text, nullable=False)
    sentiment = Column(String(20), nullable=False)
    sentiment_score = Column(Float, nullable=False)
    key_points = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        # Parse key_points from JSON string to list
        key_points = []
        if self.key_points:
            try:
                key_points = json.loads(self.key_points)
            except (json.JSONDecodeError, TypeError):
                # If not valid JSON, treat as plain string
                key_points = [self.key_points] if isinstance(self.key_points, str) else []
        
        return {
            'id': self.id,
            'review_text': self.review_text,
            'sentiment': self.sentiment,
            'sentiment_score': self.sentiment_score,
            'key_points': key_points,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Create tables
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tabel berhasil dibuat!")