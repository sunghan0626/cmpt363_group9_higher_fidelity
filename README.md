# EASY FIT Prototype

Small Flask + static HTML/CSS/JS prototype for the EASY FIT onboarding, workout generation, session, and chatbot walkthrough.

## Run

```bash
pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000/`.

## Structure

- HTML templates live in `templates/`
- CSS, JS, and images live in `static/`
- The backend entry point is `app.py`

## Environment

Set `OPENAI_API_KEY` as an environment variable before starting the app if you want the chatbot to use the backend AI route. Without it, the frontend keeps its local fallback behavior.
