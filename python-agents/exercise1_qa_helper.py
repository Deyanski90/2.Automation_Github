from openai_agents import Agent, ModelSettings
import os

def main():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set. Please set it in your environment and rerun.")
        return

    agent = Agent(
        name="QA Helper",
        instructions="You help with QA testing questions, explain reasoning clearly.",
        model="gpt-4o",
        model_settings=ModelSettings(temperature=0.2, max_tokens=200),
        api_key=api_key
    )

    prompt = "Explain boundary value testing."
    print(f"Sending prompt to agent: {prompt}\n")

    response = agent.run(prompt)
    print("Agent response:\n")
    print(response)

if __name__ == '__main__':
    main()
