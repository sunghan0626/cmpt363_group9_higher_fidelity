import os
import traceback

from flask import Flask, abort, jsonify, render_template, request
from google import genai
from google.genai import types


DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
PAIN_KEYWORDS = ("pain", "hurt", "hurts", "injury", "injured", "sharp", "worsening")
PAGE_TEMPLATES = {
    "splash.html",
    "index.html",
    "next.html",
    "loading.html",
    "workout.html",
    "session.html",
    "break.html",
    "chatbot.html",
    "complete.html",
}

app = Flask(__name__)


def is_pain_question(question: str) -> bool:
    normalized = question.lower()
    return any(keyword in normalized for keyword in PAIN_KEYWORDS)


def build_system_prompt(payload: dict) -> str:
    pain_guidance = (
        "If the question mentions pain or discomfort, do not diagnose. "
        "Tell the user to stop if pain is sharp or worsening, and suggest lowering intensity, "
        "trying an alternative, or consulting a qualified professional if needed."
    )

    return (
        "You are the EASY FIT coach, a helpful workout assistant inside a student fitness prototype. "
        "Reply in plain language with 2 to 4 short sentences. "
        "Be supportive, specific to the current exercise and plan, and avoid overexplaining. "
        "Reference the user's goals, intensity, and beginner setting when it helps. "
        "Do not invent medical advice or certainty. "
        f"{pain_guidance}"
    )


def build_user_prompt(payload: dict) -> str:
    instructions = payload.get("exerciseInstructions") or []
    instruction_text = "\n".join(f"- {step}" for step in instructions) if instructions else "- Not provided"
    goals = payload.get("selectedGoals") or []
    goal_text = ", ".join(goals) if goals else "general fitness"

    return (
        "Current workout context:\n"
        f"- Exercise: {payload.get('exerciseName', 'Unknown exercise')}\n"
        f"- Prescription: {payload.get('prescription', 'Not provided')}\n"
        f"- Goals: {goal_text}\n"
        f"- Intensity: {payload.get('intensity', 'Not provided')}\n"
        f"- Beginner: {payload.get('beginner', 'Not provided')}\n"
        "- Exercise instructions:\n"
        f"{instruction_text}\n\n"
        f"User question: {payload.get('userQuestion', '').strip()}"
    )


def create_gemini_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    return genai.Client(api_key=api_key)


def get_ai_coach_answer(payload: dict) -> str:
    client = create_gemini_client()
    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=build_user_prompt(payload),
        config=types.GenerateContentConfig(
            system_instruction=build_system_prompt(payload),
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        ),
    )

    answer = (response.text or "").strip()

    if not answer:
        raise RuntimeError("The model returned an empty answer.")

    if is_pain_question(payload.get("userQuestion", "")):
        lower_answer = answer.lower()

        if "stop" not in lower_answer:
            answer += " Stop the exercise if the pain feels sharp or keeps getting worse."

        if "diagnos" not in lower_answer:
            answer += " I cannot diagnose pain."

    return answer


@app.post("/ask_coach")
def ask_coach():
    payload = request.get_json(silent=True) or {}
    required_fields = (
        "exerciseName",
        "prescription",
        "exerciseInstructions",
        "selectedGoals",
        "intensity",
        "beginner",
        "userQuestion",
    )

    missing = [field for field in required_fields if field not in payload]

    if missing:
        return jsonify({
            "error": f"Missing required fields: {', '.join(missing)}",
            "error_type": "BadRequest"
        }), 400

    if not str(payload.get("userQuestion", "")).strip():
        return jsonify({"error": "userQuestion is required.", "error_type": "BadRequest"}), 400

    try:
        answer = get_ai_coach_answer(payload)
    except RuntimeError as error:
        print(f"[/ask_coach] RuntimeError: {error}")
        traceback.print_exc()
        return jsonify({"error": str(error), "error_type": type(error).__name__}), 503
    except Exception as error:
        print(f"[/ask_coach] {type(error).__name__}: {repr(error)}")
        traceback.print_exc()
        return jsonify({
            "error": f"Unable to generate a coach answer: {error}",
            "error_type": type(error).__name__
        }), 502

    return jsonify({"answer": answer})


@app.get("/")
def serve_root():
    return render_template("splash.html")


@app.get("/<page_name>")
def serve_page(page_name: str):
    if page_name not in PAGE_TEMPLATES:
        abort(404)

    return render_template(page_name)


if __name__ == "__main__":
    print(
        f"[startup] EASY FIT backend starting | model={DEFAULT_MODEL} | "
        f"gemini_key_present={'yes' if bool(os.getenv('GEMINI_API_KEY')) else 'no'}"
    )
    app.run(debug=False)
