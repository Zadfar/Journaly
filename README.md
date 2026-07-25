# Journaly

> A mindful, AI-assisted journaling platform designed to help you track your emotional well-being and reflect on your daily life.

A data-driven journaling platform integrating LLM-based writing assistance, native voice dictation, and robust emotional analytics to help users track their mental well-being over time.

## 🚀 Key Features

* **"Go Deeper" AI Prompts:** Overcome writer's block. Journaly reads your current draft and previous joural entries and injects thought-provoking, contextual prompts directly into your canvas to encourage deeper reflection.
* **Voice-to-Text Dictation:** Seamlessly dictate your thoughts directly into the editor using the native browser Web Speech API—no external plugins required.
* **Mood Tracking & Visualization:** Log your daily emotions on a 5-point scale. View your emotional flow via interactive 30-day area charts (Recharts) and a color-coded monthly calendar heat-map.
* **Weekly AI Insights:** Receive automated, AI-generated weekly wrap-ups that analyze your entries to pull out a headline, a narrative summary, and a "Key Discovery" about your mental state.
* **Frictionless Authentication:** Secure Email and Google OAuth sign-in, powered by Supabase, featuring dynamic SVG avatars.

## 🛠️ Tech Stack

**Frontend**

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS v4
* **State Management & Caching:** React Query (`@tanstack/react-query`)
* **Editor:** TipTap
* **Data Visualization:** Recharts
* **Icons:** Lucide React

**Backend**

* **Framework:** FastAPI (Python)
* **Database & Authentication:** Supabase (PostgreSQL)
* **AI Integration:** LLM endpoints for contextual prompts and weekly summaries

## ⚙️ Getting Started

### Prerequisites

Make sure you have Node.js and Python installed on your machine. You will also need a Supabase project set up.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/journaly.git
cd journaly

```

### 2. Frontend Setup

Navigate to the frontend directory, install dependencies, and set up your environment variables.

```bash
cd frontend
npm install

```

Create a `.env` file in the frontend directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000

```

Start the development server:

```bash
npm run dev

```

### 3. Backend Setup

Navigate to the backend directory, set up a virtual environment, and install dependencies.

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

```

Create a `.env` file in the backend directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_ai_provider_key

```

Run the FastAPI server:

```bash
fastapi run

```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
