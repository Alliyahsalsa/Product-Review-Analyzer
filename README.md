# Product Review Analyzer

**Tugas Individu 3 – PAW**

**Nama**: Alliyah Salsabilla

**NIM**: 123140014

**Kelas**: RB

Aplikasi web untuk menganalisis ulasan produk menggunakan teknologi AI. Backend dibangun menggunakan **Flask**, **SQLAlchemy**, dan model **Hugging Face Transformers** untuk analisis sentimen serta AI model untuk ekstraksi poin penting. Data hasil analisis disimpan dalam **SQLite database**.

---

# Fitur Utama

* **Sentiment Analysis**
  Mengklasifikasikan ulasan menjadi *Positive*, *Negative*, atau *Neutral* menggunakan model sentiment `distilbert-base-uncased-finetuned-sst-2-english`.

* **Key Point Extraction**
  Mengambil poin–poin penting dari ulasan menggunakan fungsi pemrosesan AI di backend.

* **Neutral Logic**
  Sentimen akan dianggap *neutral* jika confidence score < 0.70.

* **Database Storage (SQLite)**
  Hasil analisis disimpan pada file database lokal `product_reviews.db`.

* **REST API Backend**
  Menyediakan endpoint untuk analisis review dan pengambilan data review.

---

# Tech Stack

## Backend

* **Python 3.x**
* **Flask** (framework backend)
* **SQLAlchemy** (ORM)
* **SQLite** (database lokal)
* **Transformers** (sentiment analysis)
* **Torch** (model executor)
* **python-dotenv**

## Frontend

* **React.js**
* **Fetch API** untuk komunikasi dengan backend

---

# Prasyarat

Pastikan sudah terinstall:

* Python 3.13
* Node.js
* pip

---

# Cara Menjalankan Aplikasi

## 1. Setup Backend

Masuk ke folder `backend`:

```bash
cd backend
```

Buat virtual environment:

```bash
python -m venv venv
```

Aktifkan venv:

```bash
venv\Scripts\activate       # Windows
# atau
source venv/bin/activate   # Mac/Linux
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Jika kamu tidak menggunakan requirements.txt:

```bash
pip install flask flask-cors sqlalchemy transformers torch python-dotenv
```

## 2. File `.env`

Karena kamu pakai SQLite, cukup isi:

```env
DATABASE_URL=sqlite:///product_reviews.db
```

Simpan file `.env` di dalam folder backend.

## 3. Inisialisasi Database

File database `product_reviews.db` akan otomatis dibuat ketika `models.py` dijalankan melalui `app.py`.

Jika ingin memaksa membuat database:

```bash
python models.py
```

## 4. Jalankan Backend

```bash
python app.py
```

Jika berhasil, akan muncul:

```
🚀 Starting Product Review Analyzer Backend
API Endpoints:
http://localhost:5000/api/test
```

---

## 5. Setup Frontend (React)

Masuk ke folder frontend:

```bash
cd frontend
npm install
npm start
```

Aplikasi berjalan di:

```
http://localhost:3000

```

---

# API Documentation

## 1. **Analyze Review**

* **URL**: `/api/analyze-review`
* **Method**: `POST`

Contoh Request Body:

```json
{
  "product_name": "iPhone 15",
  "review_text": "The camera quality is amazing but the battery drains too fast."
}
```

Contoh Response:

```json
{
  "status": "success",
  "message": "Review analyzed and saved successfully",
  "data": {
    "id": 1,
    "product_name": "iPhone 15",
    "sentiment": "negative",
    "sentiment_score": 0.89,
    "key_points": ["Amazing camera", "Battery drains fast"],
    "created_at": "2025-12-12T12:00:00"
  }
}
```

---

## 2. **Get All Reviews**

* **URL**: `/api/reviews`
* **Method**: `GET`

Contoh Response:

```json
{
  "status": "success",
  "count": 10,
  "data": [...]
}
```

---

# Struktur Project

```bash
Product Review Analyzer/
│
├── backend/
│   ├── app.py                 # Flask routes
│   ├── analyzer.py            # Sentiment & key-point logic
│   ├── models.py              # ORM & database model
│   ├── product_reviews.db     # SQLite database
│   ├── .env                   # Environment variables
│   └── requirements.txt       # Backend dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── node_modules/
│
└── README.md
```

---

# Testing

### Test dengan curl

```bash
curl -X POST http://localhost:5000/api/analyze-review \
-H "Content-Type: application/json" \
-d "{\"review_text\": \"Great quality but too expensive.\"}"
```

Ambil semua review:

```bash
curl http://localhost:5000/api/reviews
```

---

# Troubleshooting

### 1. Tidak muncul output saat menjalankan `python app.py`

Pastikan:

* Interpreter memakai Python 3.13 (sudah benar)
* Venv sudah aktif
* Tidak ada error import
* Print di awal file tidak di-comment

### 2. Error Torch / Transformers di Python 3.13

Gunakan versi yang kompatibel:

```
pip install transformers==4.36.2
pip install torch==2.2.0
```

### 3. Database tidak muncul

Pastikan folder backend memiliki permission menulis file.

---

# Dokumentasi Hasil

1. inputan untuk melakukan pengecekan product review analyzer
<img width="1919" height="974" alt="Screenshot 2025-12-12 180101" src="https://github.com/user-attachments/assets/13eae596-e9ef-40f3-a6de-e628665162d8" />

2. Recent Reviews
<img width="1919" height="1053" alt="Screenshot 2025-12-12 175938" src="https://github.com/user-attachments/assets/c425f5cb-8bbb-4d02-9a35-bb21cdf1eb17" />
