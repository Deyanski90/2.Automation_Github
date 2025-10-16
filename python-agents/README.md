Setup

1. Create a Python 3.10+ virtual environment:

   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

2. Install dependencies:

   pip install -r requirements.txt

3. Set your environment variable (PowerShell):

   $env:OPENAI_API_KEY = "your_api_key_here"

Running the exercises

Each exercise is a standalone script in this folder. Run them with:

    python exercise1_qa_helper.py

Notes

- This repo assumes `openai-agents` API similar to the pseudocode used in the exercises.
- If `openai-agents` changes, small edits may be needed to match the package API.
