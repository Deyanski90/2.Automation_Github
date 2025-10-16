from openai_agents import Agent, ModelSettings
import os

# This script demonstrates adding a WebSearchTool to an agent. If the real package
# exposes a WebSearchTool, replace the stub below with the real import.

class WebSearchTool:
    def __init__(self):
        pass

    def search(self, query):
        # Very small stub: in real usage, call an API like Bing/SerpAPI and return results
        return [{"title": "Boundary Testing - Example",
                 "snippet": "Boundary value testing focuses on values at the edge of equivalence classes.",
                 "url": "https://example.com/boundary-testing"}]


def main():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not set. Please set it in your environment and rerun.")
        return

    web_tool = WebSearchTool()

    agent = Agent(
        name="QA Helper with Web",
        instructions="You help with QA testing questions, fetch up-to-date info when asked and cite sources.",
        model="gpt-4o",
        model_settings=ModelSettings(temperature=0.2, max_tokens=300),
        api_key=api_key,
        tools=[web_tool]
    )

    prompt = "What is the latest guidance for boundary value testing? Cite sources."
    print(f"Sending prompt to agent: {prompt}\n")

    # Example of agent using tool - API may differ; this is illustrative
    # If Agent.run accepts tool usage automatically, this will work. Otherwise adapt.
    response = agent.run(prompt)
    print("Agent response:\n")
    print(response)

if __name__ == '__main__':
    main()
