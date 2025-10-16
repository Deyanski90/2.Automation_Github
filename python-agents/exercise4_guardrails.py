from openai_agents import Agent, ModelSettings
import os
import re

PROFANITY = ["badword1", "badword2"]


def check_profanity(text):
    t = text.lower()
    for p in PROFANITY:
        if p in t:
            return True
    return False


def validate_testcase_format(text):
    # Very simple check: must mention "Steps" and "Expected" (case-insensitive)
    return bool(re.search(r"steps", text, re.I)) and bool(re.search(r"expected", text, re.I))


def main():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set. Please set it in your environment and rerun.")
        return

    agent = Agent(name="QA Guardrail Agent", instructions="Provide QA help but enforce guardrails.", model="gpt-4o", model_settings=ModelSettings(temperature=0.2, max_tokens=300))

    inputs = [
        "Write a test case: Steps: 1) Open login. Expected: show dashboard.",
        "This is a badword1 test"
    ]

    for i in inputs:
        print(f"Input:\n{i}\n")
        if check_profanity(i):
            print("Rejected: profanity detected.\n")
            continue
        if not validate_testcase_format(i):
            print("Rejected: test case format invalid (requires 'Steps' and 'Expected').\n")
            continue
        resp = agent.run(i)
        print("Agent response:\n", resp)

if __name__ == '__main__':
    main()
